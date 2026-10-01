import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight,
  Calculator,
  Compass,
  BookOpen,
  FileText
} from "lucide-react";

interface SubItem {
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const toolsItems: SubItem[] = [
  {
    title: "Wealth Calculators",
    href: "/calculators",
    description: "Model SIP, retirement, tax savings & compounding.",
    icon: Calculator,
  },
  {
    title: "Risk Profile Quiz",
    href: "/risk-profile",
    description: "Scientific 10-point SEBI suitability assessment.",
    icon: Compass,
  },
];

const resourcesItems: SubItem[] = [
  {
    title: "Insights",
    href: "/insights",
    description: "Fiduciary commentary, market teardowns & tax notes.",
    icon: BookOpen,
  },
  {
    title: "Downloads & Forms",
    href: "/downloads",
    description: "Statutory onboarding KYC, agreements & disclosure PDFs.",
    icon: FileText,
  },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<"tools" | "resources" | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Mobile accordions
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Transparent over hero (< 30px), slim blurred ivory/navy bar when scrolled
          setIsScrolled(currentScrollY > 30);

          // Hide on scroll-down, show on scroll-up
          if (currentScrollY <= 30) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY.current + 6) {
            setIsVisible(false);
            setOpenDropdown(null);
          } else if (currentScrollY < lastScrollY.current - 6) {
            setIsVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
    setMobileToolsOpen(false);
    setMobileResourcesOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Close dropdown on click outside or on Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleMouseEnter = (menu: "tools" | "resources") => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -90 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#070B14]/90 backdrop-blur-md border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* LEFT: Logo Lockup */}
            <Link to="/" className="flex items-center gap-3 group focus:outline-none flex-shrink-0">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#C9A24B]/35 flex-shrink-0 bg-[#070B14] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo-circular1.png"
                  alt="Alpha Investment Management"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base tracking-tight font-medium text-[#F5F1E8] group-hover:text-[#C9A24B] transition-colors duration-200">
                  Alpha Investment
                </span>
                <span className="text-[9px] font-sans uppercase tracking-widest text-slate-400">
                  SEBI RIA · INA000017348
                </span>
              </div>
            </Link>

            {/* CENTER: Clean 5-Item Nav + Contact Link */}
            <nav
              ref={navRef}
              className="hidden lg:flex items-center gap-7"
              aria-label="Main Navigation"
            >
              {/* 1. Home */}
              <Link
                to="/"
                className={`text-xs uppercase tracking-wider font-sans transition-colors py-1 relative ${
                  location.pathname === "/"
                    ? "text-[#C9A24B] font-medium"
                    : "text-slate-300/80 hover:text-[#F5F1E8]"
                }`}
              >
                Home
                {location.pathname === "/" && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A24B]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

              {/* 2. About */}
              <Link
                to="/about"
                className={`text-xs uppercase tracking-wider font-sans transition-colors py-1 relative ${
                  location.pathname === "/about"
                    ? "text-[#C9A24B] font-medium"
                    : "text-slate-300/80 hover:text-[#F5F1E8]"
                }`}
              >
                About
                {location.pathname === "/about" && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A24B]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

              {/* 3. Services */}
              <Link
                to="/services"
                className={`text-xs uppercase tracking-wider font-sans transition-colors py-1 relative ${
                  location.pathname.startsWith("/services")
                    ? "text-[#C9A24B] font-medium"
                    : "text-slate-300/80 hover:text-[#F5F1E8]"
                }`}
              >
                Services
                {location.pathname.startsWith("/services") && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A24B]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

              {/* 4. Tools ▾ Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => handleMouseEnter("tools")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "tools" ? null : "tools")}
                  className={`text-xs uppercase tracking-wider font-sans transition-colors inline-flex items-center gap-1 focus:outline-none ${
                    location.pathname === "/calculators" || location.pathname === "/risk-profile" || openDropdown === "tools"
                      ? "text-[#C9A24B] font-medium"
                      : "text-slate-300/80 hover:text-[#F5F1E8]"
                  }`}
                  aria-expanded={openDropdown === "tools"}
                >
                  <span>Tools</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      openDropdown === "tools" ? "rotate-180 text-[#C9A24B]" : "text-slate-400"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openDropdown === "tools" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute top-full left-0 w-[300px] p-2 rounded-2xl bg-[#0B1220] border border-white/[0.12] shadow-2xl z-50 space-y-1"
                    >
                      {toolsItems.map((item) => {
                        const Icon = item.icon;
                        const isItemActive = location.pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setOpenDropdown(null)}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] ${
                              isItemActive
                                ? "bg-[#C9A24B]/10 border border-[#C9A24B]/20"
                                : "hover:bg-white/[0.04] border border-transparent"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[#C9A24B] group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[13px] sm:text-[14px] font-sans font-semibold text-[#F5F1E8] group-hover:text-[#C9A24B] transition-colors">
                                {item.title}
                              </p>
                              <p className="text-[12px] text-[#A8B0BD] font-sans font-light leading-snug">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 5. Resources ▾ Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => handleMouseEnter("resources")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "resources" ? null : "resources")}
                  className={`text-xs uppercase tracking-wider font-sans transition-colors inline-flex items-center gap-1 focus:outline-none ${
                    location.pathname.startsWith("/insights") || location.pathname === "/downloads" || openDropdown === "resources"
                      ? "text-[#C9A24B] font-medium"
                      : "text-slate-300/80 hover:text-[#F5F1E8]"
                  }`}
                  aria-expanded={openDropdown === "resources"}
                >
                  <span>Resources</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      openDropdown === "resources" ? "rotate-180 text-[#C9A24B]" : "text-slate-400"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openDropdown === "resources" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[310px] p-2 rounded-2xl bg-[#090E1C]/95 backdrop-blur-xl border border-white/[0.12] shadow-2xl z-50 space-y-1"
                    >
                      {resourcesItems.map((item) => {
                        const Icon = item.icon;
                        const isItemActive = location.pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setOpenDropdown(null)}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                              isItemActive
                                ? "bg-[#C9A24B]/10 border border-[#C9A24B]/20"
                                : "hover:bg-white/[0.04] border border-transparent"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[#C9A24B] group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-sans font-semibold text-[#F5F1E8] group-hover:text-[#C9A24B] transition-colors">
                                {item.title}
                              </p>
                              <p className="text-[11px] text-slate-400 font-sans font-light leading-snug">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact (Plain Link) */}
              <Link
                to="/contact"
                className={`text-xs uppercase tracking-wider font-sans transition-colors py-1 relative ${
                  location.pathname === "/contact"
                    ? "text-[#C9A24B] font-medium"
                    : "text-slate-300/80 hover:text-[#F5F1E8]"
                }`}
              >
                Contact
                {location.pathname === "/contact" && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A24B]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </nav>

            {/* RIGHT: EXACTLY ONE PRIMARY BUTTON */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              <Link
                to="/contact"
                className="bg-[#C9A24B] hover:bg-[#DCB862] text-[#070B14] font-sans font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-[#C9A24B]/20 active:scale-[0.98] inline-flex items-center gap-1.5 focus:outline-none"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* MOBILE: Hamburger Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-[#F5F1E8] hover:text-[#C9A24B] focus:outline-none transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

          </div>
        </div>
      </motion.header>

      {/* MOBILE FULL-SCREEN MENU OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#070B14] text-[#F5F1E8] flex flex-col justify-between pt-6 pb-8 px-6 sm:px-8 lg:hidden overflow-y-auto"
          >
            {/* Top Bar with Brand & Close Button */}
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C9A24B]/40">
                  <img
                    src="/logo-circular1.png"
                    alt="Alpha Investment Management"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-sm tracking-tight font-medium text-[#F5F1E8]">
                    Alpha Investment
                  </span>
                  <span className="text-[8px] font-sans uppercase tracking-widest text-slate-400">
                    SEBI RIA · INA000017348
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-[#F5F1E8] hover:text-[#C9A24B] focus:outline-none transition-colors"
                aria-label="Close Navigation Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Center: Stacked Serif Links with Inline Accordions for Tools and Resources */}
            <div className="py-6 space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-[#C9A24B] font-mono block">
                Fiduciary Navigation
              </span>

              <div className="space-y-4">
                {/* Home */}
                <Link
                  to="/"
                  onClick={() => setIsMobileOpen(false)}
                  className="block font-serif text-2xl text-[#F5F1E8] hover:text-[#C9A24B] transition-colors"
                >
                  Home
                </Link>

                {/* About */}
                <Link
                  to="/about"
                  onClick={() => setIsMobileOpen(false)}
                  className="block font-serif text-2xl text-[#F5F1E8] hover:text-[#C9A24B] transition-colors"
                >
                  About
                </Link>

                {/* Services */}
                <Link
                  to="/services"
                  onClick={() => setIsMobileOpen(false)}
                  className="block font-serif text-2xl text-[#F5F1E8] hover:text-[#C9A24B] transition-colors"
                >
                  Services
                </Link>

                {/* Tools Accordion */}
                <div className="border-y border-white/[0.06] py-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                    className="w-full flex items-center justify-between font-serif text-2xl text-[#F5F1E8] hover:text-[#C9A24B] transition-colors text-left"
                  >
                    <span>Tools</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                        mobileToolsOpen ? "rotate-180 text-[#C9A24B]" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileToolsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-3 pt-2 space-y-3"
                      >
                        {toolsItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="block space-y-0.5 group"
                          >
                            <p className="text-sm font-sans font-medium text-[#F5F1E8] group-hover:text-[#C9A24B] transition-colors">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-400 font-sans font-light">
                              {item.description}
                            </p>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Resources Accordion */}
                <div className="border-b border-white/[0.06] pb-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                    className="w-full flex items-center justify-between font-serif text-2xl text-[#F5F1E8] hover:text-[#C9A24B] transition-colors text-left"
                  >
                    <span>Resources</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                        mobileResourcesOpen ? "rotate-180 text-[#C9A24B]" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileResourcesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-3 pt-2 space-y-3"
                      >
                        {resourcesItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="block space-y-0.5 group"
                          >
                            <p className="text-sm font-sans font-medium text-[#F5F1E8] group-hover:text-[#C9A24B] transition-colors">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-400 font-sans font-light">
                              {item.description}
                            </p>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Contact */}
                <Link
                  to="/contact"
                  onClick={() => setIsMobileOpen(false)}
                  className="block font-serif text-2xl text-[#F5F1E8] hover:text-[#C9A24B] transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Bottom Pinned CTA: Book a Consultation */}
            <div className="pt-4 border-t border-white/[0.08]">
              <Link
                to="/contact"
                onClick={() => setIsMobileOpen(false)}
                className="w-full py-4 rounded-full bg-[#C9A24B] hover:bg-[#DCB862] text-[#070B14] font-semibold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
