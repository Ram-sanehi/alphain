import { useRef, useEffect, useState } from "react";
import { MotionValue, useReducedMotion } from "framer-motion";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  CatmullRomCurve3,
  Vector3,
  BufferGeometry,
  Float32BufferAttribute,
  ShaderMaterial,
  Mesh,
  Color,
  Vector2,
} from "three";

interface MilestoneThreeBackgroundProps {
  scrollYProgress: MotionValue<number>;
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// Generate a wide, smooth ribbon strip along a 3D curve
function createRibbonGeometry(
  curve: CatmullRomCurve3,
  segments: number,
  width: number
): BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const up = new Vector3(0, 0, 1);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const pt = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const normal = new Vector3().crossVectors(tangent, up).normalize();
    if (normal.lengthSq() < 0.001) {
      normal.set(0, 1, 0);
    }

    // Top and bottom ribbon vertices
    const p1 = new Vector3().addVectors(pt, normal.clone().multiplyScalar(width * 0.5));
    const p2 = new Vector3().addVectors(pt, normal.clone().multiplyScalar(-width * 0.5));

    positions.push(p1.x, p1.y, p1.z);
    positions.push(p2.x, p2.y, p2.z);

    uvs.push(t, 0);
    uvs.push(t, 1);

    if (i < segments) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = (i + 1) * 2;
      const d = (i + 1) * 2 + 1;

      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

export function MilestoneThreeBackground({ scrollYProgress }: MilestoneThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  // Check eligibility: desktop (>=768px), motion allowed, WebGL supported
  useEffect(() => {
    const checkEligibility = () => {
      const desktop = window.innerWidth >= 768;
      const motionAllowed = !shouldReduceMotion;
      const webgl = checkWebGLSupport();
      setIsEligible(desktop && motionAllowed && webgl);
    };

    checkEligibility();
    window.addEventListener("resize", checkEligibility);
    return () => window.removeEventListener("resize", checkEligibility);
  }, [shouldReduceMotion]);

  // Lazy-load: only mount Three.js when the section is within 300px of viewport
  useEffect(() => {
    if (!isEligible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isEligible]);

  // Three.js Scene Setup & Render Loop (Ribbon only, zero particles)
  useEffect(() => {
    if (!isEligible || !isNearViewport || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    let animationFrameId: number;
    let isVisible = true;

    // 1. Clean Scene
    const scene = new Scene();

    // 2. Camera
    const camera = new PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0, 8);

    // 3. Renderer with transparent clear color
    const renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.setClearColor(0x000000, 0);

    // 4. Soft Ascending Gold Ribbon (gently curved bottom-left to top-right)
    const curvePoints = [
      new Vector3(-6, -3.8, -2),
      new Vector3(-2, -2.4, -1),
      new Vector3(1.5, -0.7, 0),
      new Vector3(4.5, 1.2, 1),
      new Vector3(7.5, 3.0, 2),
      new Vector3(10, 4.6, 3),
    ];
    const curve = new CatmullRomCurve3(curvePoints, false, "centripetal");

    // Ribbon geometry: 2.2 units wide, 90 segments
    const ribbonGeometry = createRibbonGeometry(curve, 90, 2.2);

    // Custom Shader for feathered edges & left-column falloff
    const ribbonMaterial = new ShaderMaterial({
      uniforms: {
        uColor: { value: new Color(0xc9a96e) },
        uOpacity: { value: 0.20 }, // Peak opacity ~0.18-0.22
        uResolution: { value: new Vector2(container.clientWidth, container.clientHeight) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec4 vScreenPos;
        void main() {
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          vScreenPos = gl_Position;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec4 vScreenPos;

        void main() {
          // Soft feathered edges across ribbon width (center max, edges fade to 0)
          float distFromCenter = abs(vUv.y - 0.5) * 2.0;
          float edgeFade = smoothstep(1.0, 0.05, distFromCenter);

          // Soft fade at ribbon start and end
          float lengthFade = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);

          // Screen horizontal position falloff: completely fade out over left text column
          vec2 ndc = vScreenPos.xy / vScreenPos.w;
          float screenX = ndc.x * 0.5 + 0.5;
          float leftFalloff = smoothstep(0.34, 0.56, screenX);

          float alpha = edgeFade * lengthFade * leftFalloff * uOpacity;
          if (alpha <= 0.001) discard;

          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const ribbonMesh = new Mesh(ribbonGeometry, ribbonMaterial);
    scene.add(ribbonMesh);

    // Track scroll progress for gentle camera journey
    let currentScroll = scrollYProgress.get() || 0;
    const unsubScroll = scrollYProgress.on("change", (latest) => {
      currentScroll = latest;
    });

    // 5. Pause Rendering when section is off-screen
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) {
          render();
        }
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    // 6. Resize handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      ribbonMaterial.uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 7. Animation & Camera Travel Loop
    let currentCamX = 0;
    let currentCamY = 0;
    let currentCamZ = 8;

    const render = () => {
      if (!isVisible) return;

      // Gentle camera position tied to scroll progress
      const clampedProgress = Math.max(0, Math.min(1, currentScroll));
      const targetPoint = curve.getPointAt(clampedProgress * 0.65 + 0.18);

      const targetX = targetPoint.x * 0.32;
      const targetY = targetPoint.y * 0.32 + 0.1;
      const targetZ = 7.6 - clampedProgress * 1.0;

      // Smooth damping (lerp)
      currentCamX += (targetX - currentCamX) * 0.05;
      currentCamY += (targetY - currentCamY) * 0.05;
      currentCamZ += (targetZ - currentCamZ) * 0.05;

      camera.position.set(currentCamX, currentCamY, currentCamZ);
      camera.lookAt(targetPoint.x * 0.45, targetPoint.y * 0.45, targetPoint.z * 0.45);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // 8. Complete Resource Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      unsubScroll();
      visibilityObserver.disconnect();
      window.removeEventListener("resize", handleResize);

      ribbonGeometry.dispose();
      ribbonMaterial.dispose();
      renderer.dispose();
    };
  }, [isEligible, isNearViewport, scrollYProgress]);

  // Static Fallback for mobile, reduced-motion, or non-WebGL devices: soft gold radial glow only, no dots or specks
  if (isEligible === false) {
    return (
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_80%_40%,rgba(201,169,110,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(201,169,110,0.035),transparent_60%)]" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, transparent 35%, black 60%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, transparent 35%, black 60%)",
      }}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Three.js Canvas - Ribbon only */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
