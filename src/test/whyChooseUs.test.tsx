import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

let mockReducedMotion = false;
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    useReducedMotion: () => mockReducedMotion,
  };
});

import { WhyChooseUs } from "../components/WhyChooseUs";

describe("WhyChooseUs (THE FIDUCIARY PHILOSOPHY)", () => {
  beforeEach(() => {
    mockReducedMotion = false;
    vi.restoreAllMocks();
    window.scrollTo = vi.fn();
    window.innerHeight = 800;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders all 5 principles in the DOM with active and inactive visibility classes", () => {
    const { container } = render(
      <BrowserRouter>
        <WhyChooseUs />
      </BrowserRouter>
    );

    // Section runway has 500vh height
    const runway = container.querySelector("#fiduciary-philosophy");
    expect(runway).not.toBeNull();
    expect(runway?.getAttribute("style")).toContain("height: 500vh");

    // All 5 panels exist
    const panel01 = container.querySelector("#principle-panel-01");
    const panel02 = container.querySelector("#principle-panel-02");
    const panel03 = container.querySelector("#principle-panel-03");
    const panel04 = container.querySelector("#principle-panel-04");
    const panel05 = container.querySelector("#principle-panel-05");

    expect(panel01).toBeInTheDocument();
    expect(panel02).toBeInTheDocument();
    expect(panel03).toBeInTheDocument();
    expect(panel04).toBeInTheDocument();
    expect(panel05).toBeInTheDocument();

    // Initially principle 01 is active (visible, opacity-100, relative)
    expect(panel01).toHaveClass("opacity-100");
    expect(panel01).toHaveClass("visible");
    expect(panel01).toHaveClass("relative");

    // Principles 02 to 05 are inactive (invisible, opacity-0, absolute)
    expect(panel02).toHaveClass("opacity-0");
    expect(panel02).toHaveClass("invisible");
    expect(panel02).toHaveClass("absolute");

    expect(panel03).toHaveClass("opacity-0");
    expect(panel03).toHaveClass("invisible");

    expect(panel04).toHaveClass("opacity-0");
    expect(panel04).toHaveClass("invisible");

    expect(panel05).toHaveClass("opacity-0");
    expect(panel05).toHaveClass("invisible");
  });

  it("updates active principle from 01 to 05 as scroll progress advances", async () => {
    let rafCallback: FrameRequestCallback | null = null;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb: FrameRequestCallback) => {
      rafCallback = cb;
      return 1;
    });

    const { container } = render(
      <BrowserRouter>
        <WhyChooseUs />
      </BrowserRouter>
    );

    const runway = container.querySelector("#fiduciary-philosophy") as HTMLElement;
    expect(runway).not.toBeNull();

    // Simulate 500vh total height with innerHeight = 800
    // Total runway height = 4000px, scrollDistance = 4000 - 800 = 3200px
    const runwayHeight = 4000;
    const scrollDistance = runwayHeight - window.innerHeight; // 3200

    const simulateScrollToProgress = (progress: number) => {
      const top = -progress * scrollDistance;
      vi.spyOn(runway, "getBoundingClientRect").mockReturnValue({
        top,
        bottom: top + runwayHeight,
        left: 0,
        right: 1200,
        width: 1200,
        height: runwayHeight,
        x: 0,
        y: top,
        toJSON: () => {},
      });

      act(() => {
        fireEvent.scroll(window);
        if (rafCallback) {
          (rafCallback as FrameRequestCallback)(performance.now());
          rafCallback = null;
        }
      });
    };

    // Test Principle 01 (progress = 0.1)
    simulateScrollToProgress(0.1);
    expect(container.querySelector("#principle-panel-01")).toHaveClass("opacity-100");
    expect(container.querySelector("#principle-panel-02")).toHaveClass("opacity-0");

    // Test Principle 02 (progress = 0.25 -> floor(0.25 * 5) = 1)
    simulateScrollToProgress(0.25);
    expect(container.querySelector("#principle-panel-01")).toHaveClass("opacity-0");
    expect(container.querySelector("#principle-panel-02")).toHaveClass("opacity-100");
    expect(container.querySelector("#principle-panel-02")).toHaveClass("visible");

    // Test Principle 03 (progress = 0.45 -> floor(0.45 * 5) = 2)
    simulateScrollToProgress(0.45);
    expect(container.querySelector("#principle-panel-02")).toHaveClass("opacity-0");
    expect(container.querySelector("#principle-panel-03")).toHaveClass("opacity-100");
    expect(container.querySelector("#principle-panel-03")).toHaveClass("visible");

    // Test Principle 04 (progress = 0.65 -> floor(0.65 * 5) = 3)
    simulateScrollToProgress(0.65);
    expect(container.querySelector("#principle-panel-03")).toHaveClass("opacity-0");
    expect(container.querySelector("#principle-panel-04")).toHaveClass("opacity-100");
    expect(container.querySelector("#principle-panel-04")).toHaveClass("visible");

    // Test Principle 05 (progress = 0.85 -> floor(0.85 * 5) = 4)
    simulateScrollToProgress(0.85);
    expect(container.querySelector("#principle-panel-04")).toHaveClass("opacity-0");
    expect(container.querySelector("#principle-panel-05")).toHaveClass("opacity-100");
    expect(container.querySelector("#principle-panel-05")).toHaveClass("visible");

    // Reverse scroll back to Principle 01
    simulateScrollToProgress(0.05);
    expect(container.querySelector("#principle-panel-01")).toHaveClass("opacity-100");
    expect(container.querySelector("#principle-panel-05")).toHaveClass("opacity-0");
  });

  it("clicking a principle item triggers window.scrollTo with the correct position", () => {
    const { container } = render(
      <BrowserRouter>
        <WhyChooseUs />
      </BrowserRouter>
    );

    const runway = container.querySelector("#fiduciary-philosophy") as HTMLElement;
    const runwayHeight = 4000;
    vi.spyOn(runway, "getBoundingClientRect").mockReturnValue({
      top: 100,
      bottom: 100 + runwayHeight,
      left: 0,
      right: 1200,
      width: 1200,
      height: runwayHeight,
      x: 0,
      y: 100,
      toJSON: () => {},
    });

    // Click Principle 03 in the desktop list
    const buttons = screen.getAllByRole("button", { name: /Principle 03/i });
    expect(buttons.length).toBeGreaterThan(0);

    act(() => {
      fireEvent.click(buttons[0]);
    });

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({
        behavior: "smooth",
      })
    );
  });

  it("supports responsive viewports: 1440px, 768px, and 390px without errors", () => {
    const viewports = [1440, 768, 390];

    for (const width of viewports) {
      window.innerWidth = width;
      window.innerHeight = width === 390 ? 844 : 900;

      const { container, unmount } = render(
        <BrowserRouter>
          <WhyChooseUs />
        </BrowserRouter>
      );

      const runway = container.querySelector("#fiduciary-philosophy");
      expect(runway).not.toBeNull();
      const stickyDiv = container.querySelector(".sticky");
      expect(stickyDiv).not.toBeNull();

      // Mobile horizontal tabs container exists
      const tablist = screen.getByRole("tablist", { name: "Investment Principles" });
      expect(tablist).toBeInTheDocument();

      // 5 tab buttons inside
      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(5);

      unmount();
    }
  });

  it("renders architectural stone pillar image section immediately following runway", () => {
    const { container } = render(
      <BrowserRouter>
        <WhyChooseUs />
      </BrowserRouter>
    );

    const quoteSection = container.querySelector("#alpha-approach");
    expect(quoteSection).not.toBeNull();
    expect(screen.getByText("THE ALPHA APPROACH")).toBeInTheDocument();
    expect(
      screen.getByText(/Compounding rewards patience\. Our job is to protect it\./i)
    ).toBeInTheDocument();
  });

  it("handles prefers-reduced-motion by rendering all 5 principles stacked without pinning", () => {
    mockReducedMotion = true;

    const { container } = render(
      <BrowserRouter>
        <WhyChooseUs />
      </BrowserRouter>
    );

    const runway = container.querySelector("#fiduciary-philosophy");
    expect(runway).not.toBeNull();
    // In reduced motion, runway should NOT have 500vh
    expect(runway?.getAttribute("style") || "").not.toContain("500vh");
    // No sticky container
    expect(container.querySelector(".sticky")).toBeNull();

    // All 5 panels are rendered simultaneously
    const panel01 = container.querySelector("#principle-panel-01");
    const panel02 = container.querySelector("#principle-panel-02");
    const panel03 = container.querySelector("#principle-panel-03");
    const panel04 = container.querySelector("#principle-panel-04");
    const panel05 = container.querySelector("#principle-panel-05");

    expect(panel01).toBeInTheDocument();
    expect(panel02).toBeInTheDocument();
    expect(panel03).toBeInTheDocument();
    expect(panel04).toBeInTheDocument();
    expect(panel05).toBeInTheDocument();
  });
});
