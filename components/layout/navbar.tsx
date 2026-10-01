"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavLinkItem {
  href: string;
  label: string;
  external?: boolean;
}

const navLinks: NavLinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "https://insurancemall.alphaaim.in", label: "Insurance Mall", external: true },
  { href: "/#insights", label: "Insights" },
  { href: "/#empanelment", label: "Empanelment" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Header is transparent over hero, turns into slim blurred bar on scroll
      setIsScrolled(currentScrollY > 40);

      // Hide on scroll-down, show on scroll-up
      if (currentScrollY <= 40) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollYRef.current + 8) {
        // Scrolling down -> hide
        setIsVisible(false);
      } else if (currentScrollY < lastScrollYRef.current - 8) {
        // Scrolling up -> show
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile overlay on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
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

  const menuVariants = {
    closed: {
      opacity: 0,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    },
    open: {
      opacity: 1,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const navListVariants = {
    closed: {},
    open: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.15,
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, y: 24 },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <>
      {/* Full-width Slim Header */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          isScrolled
            ? "bg-ink/85 backdrop-blur-md border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between h-18 py-3.5">
            
            {/* Left: Brand Logo */}
            <Link href="/" className="flex items-center gap-3.5 group focus:outline-none">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold/40 flex-shrink-0 bg-ink flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo-circular1.png"
                  alt="Alpha Investment Management"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base tracking-tight font-medium text-ivory group-hover:text-gold transition-colors duration-200">
                  Alpha Investment
                </span>
                <span className="text-[9px] font-sans uppercase tracking-widest text-slate-400">
                  SEBI RIA · Pune · Est. 2019
                </span>
              </div>
            </Link>

            {/* Center: Clean Uncrowded Navigation */}
            <nav className="hidden lg:flex items-center gap-7" aria-label="Main Navigation">
              {navLinks.map((link) => {
                if (link.external) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-wider font-sans text-slate-300/80 hover:text-gold transition-colors py-1 inline-flex items-center gap-1 group/ext"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover/ext:text-gold transition-colors" />
                    </a>
                  );
                }

                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs uppercase tracking-wider font-sans transition-colors py-1 relative ${
                      isActive
                        ? "text-gold font-medium"
                        : "text-slate-300/80 hover:text-ivory"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navUnderlineNext"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: ONE Clean Gold "Book a Consultation" Button */}
            <div className="hidden lg:flex items-center">
              <Link
                href="/contact"
                className="bg-gold hover:bg-gold-light text-ink font-sans font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98] inline-flex items-center gap-1.5"
              >
                <span>Book a Consultation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 text-ivory hover:text-gold focus:outline-none transition-colors"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </motion.header>

      {/* Full-Screen Mobile Menu Overlay with Staggered Large Serif Links */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-ink text-ivory flex flex-col justify-between pt-28 pb-12 px-8 lg:hidden overflow-y-auto"
          >
            {/* Ambient subtle background detail */}
            <div className="absolute top-1/4 right-8 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-8 relative z-10 max-w-md">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-gold font-mono block">
                  Private Wealth Navigation
                </span>
                <div className="w-8 h-[1px] bg-gold/40" />
              </div>

              {/* Large Serif Links with Staggered Animation */}
              <motion.nav
                variants={navListVariants}
                initial="closed"
                animate="open"
                className="flex flex-col space-y-4"
              >
                {navLinks.map((link) => (
                  <motion.div key={link.href} variants={linkVariants}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-serif text-3xl sm:text-4xl text-slate-300 hover:text-gold transition-colors inline-flex items-center gap-2"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="w-5 h-5 text-gold/70" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={`font-serif text-3xl sm:text-4xl transition-colors block ${
                          pathname === link.href
                            ? "text-gold"
                            : "text-ivory hover:text-gold"
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </motion.nav>
            </div>

            {/* Bottom Actions & Details in Mobile Menu */}
            <div className="space-y-6 pt-8 border-t border-white/[0.08] relative z-10 max-w-md">
              <div className="space-y-1 text-xs text-slate-400 font-sans">
                <p className="text-ivory font-medium">Alpha Investment Management</p>
                <p>Mahalungeker Complex, Chakan-Talegaon Hwy, Pune 410501</p>
                <p className="text-gold pt-0.5">SEBI RIA Fiduciary Standard</p>
              </div>

              <Link
                href="/contact"
                className="w-full bg-gold hover:bg-gold-light text-ink font-sans font-semibold text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-200 text-center flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Book a Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
