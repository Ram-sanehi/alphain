/**
 * Alpha Investment Management - Curated Image Asset Registry
 * Colour Grade Specification:
 * - Cool navy/charcoal shadows (#070B14 / #0B132B)
 * - Warm gold / amber highlights (#C9A24B / #D4AF37)
 * - Shallow depth of field (cinematic bokeh, clean foreground focus)
 * - Descriptive, SEO and accessibility compliant alt text on every image
 */

export interface ImageAsset {
  src: string;
  alt: string;
  caption?: string;
  category: "hero" | "team" | "families" | "services" | "textures";
}

export const IMAGES = {
  // 1. Hero: Indian city skyline at blue hour & architectural stone/glass interiors
  hero: {
    mumbaiDuskSkyline: {
      src: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=2400&q=85",
      alt: "Panoramic Mumbai and Pune business district skyline at blue hour with twilight office illumination and deep navy dusk sky",
      caption: "Financial capital skyline at blue hour",
      category: "hero",
    },
    architecturalGlassInterior: {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85",
      alt: "Modern institutional glass atrium and geometric stone colonnade reflecting golden ambient sunset light",
      caption: "Contemporary fiduciary headquarters interior",
      category: "hero",
    },
    puneCommercialHub: {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85",
      alt: "Signage-free architectural glass towers at dusk in navy shadow tones and warm ambient illumination",
      caption: "Maharashtra commercial corridor at twilight",
      category: "hero",
    }
  },

  // 2. Founder + Team: Professional portraits with unified dark studio background and warm directional lighting
  team: {
    founderNageshwarPrasad: {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85",
      alt: "Nageshwar Prasad, Founder and Principal Officer, SEBI Registered Investment Adviser, in formal dark navy attire with warm studio rim light",
      caption: "Nageshwar Prasad · Founder & Principal Officer (SEBI RIA)",
      category: "team",
    },
    chiefInvestmentOfficer: {
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
      alt: "Senior Investment Strategist in dark boardroom attire against a muted navy backdrop with warm golden key lighting",
      caption: "Senior Portfolio Manager & Head of Research",
      category: "team",
    },
    seniorWealthAdvisor: {
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85",
      alt: "Senior Private Wealth Advisor smiling warmly in a dark tailored suit with shallow depth of field portrait lighting",
      caption: "Lead Fiduciary Wealth Advisor · HNI Advisory",
      category: "team",
    },
    complianceOfficer: {
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85",
      alt: "Compliance and Legal Officer in professional dark formal attire against an architectural stone background",
      caption: "Chief Compliance Officer & Legal Counsel",
      category: "team",
    }
  },

  // 3. Families: Candid, warm, multi-generational Indian families
  families: {
    multiGenerationalLivingRoom: {
      src: "https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=1600&q=85",
      alt: "Candid multi-generational Indian family sharing a joyful conversation across grandfather, parents, and children in a warm sunlit home",
      caption: "Generational wealth preserving family legacy across decades",
      category: "families",
    },
    parentAndDaughterFuture: {
      src: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1600&q=85",
      alt: "Warm candid portrait of an Indian father and daughter outdoors enjoying peaceful quality time with shallow depth of field",
      caption: "Securing higher education and future aspirations through disciplined planning",
      category: "families",
    },
    seniorCoupleRetirement: {
      src: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1600&q=85",
      alt: "Happy senior Indian couple enjoying retirement tranquility outdoors in warm morning golden light",
      caption: "Financially independent retirement with perpetual inflation-adjusted income",
      category: "families",
    },
    familyCelebration: {
      src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=85",
      alt: "Multi-generational family gathering together in celebratory warmth, embodying protected family heritage",
      caption: "Protecting family unity and wealth continuity across generations",
      category: "families",
    }
  },

  // 4. Services: One abstract/architectural photo per core advisory service
  services: {
    investmentManagement: {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
      alt: "Geometric modern skyscraper facade reaching upward into dusk sky, symbolizing institutional capital growth and structured compounding",
      caption: "Direct equity & liquid debt asset allocation",
      category: "services",
    },
    financialPlanning: {
      src: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=85",
      alt: "Architectural blueprint and minimalist drafting desk illuminated with focused warm light, representing precise goal engineering",
      caption: "Comprehensive fee-only financial roadmap",
      category: "services",
    },
    loanServices: {
      src: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1600&q=85",
      alt: "Curved monumental stone and glass banking pavilion facade under dramatic dusk lighting, symbolizing structured liquidity and credit syndication",
      caption: "Loan against property & debt syndication",
      category: "services",
    },
    taxPlanning: {
      src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85",
      alt: "Minimalist executive desk with fountain pen and analytical documents in calm shadows, representing strategic tax-loss harvesting",
      caption: "Tax-efficient portfolio structuring & harvesting",
      category: "services",
    },
    retirementPlanning: {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85",
      alt: "Serene mountain alpine lake at sunrise with peaceful reflection, symbolizing tranquil lifelong financial freedom",
      caption: "Sustainable retirement corpus & drawdown strategy",
      category: "services",
    },
    insuranceDistribution: {
      src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85",
      alt: "Illuminated architectural glass dome providing protective overhead shelter, symbolizing comprehensive risk cover and claim advocacy",
      caption: "Independent risk protection & claim advocacy",
      category: "services",
    }
  },

  // 5. Textures: Subtle paper grain or fine marble for section backgrounds
  textures: {
    subtlePaperGrain: {
      src: "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E",
      alt: "Subtle archival parchment grain texture overlay for editorial richness",
      category: "textures",
    },
    warmIvoryMarble: {
      src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80",
      alt: "Smooth honed ivory travertine stone texture with delicate natural mineral veining",
      category: "textures",
    },
    darkInkNavyStone: {
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80",
      alt: "Deep indigo and charcoal honed slate surface with subtle organic micro-texture",
      category: "textures",
    }
  }
} as const;
