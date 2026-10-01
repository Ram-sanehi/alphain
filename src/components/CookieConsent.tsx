import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Check, X, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("aim_dpdp_cookie_consent");
    if (!consent) {
      // Delay showing banner slightly for smooth UX
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("aim_dpdp_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("aim_dpdp_cookie_consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          aria-label="Privacy & Cookie Consent"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 left-6 right-6 sm:right-auto sm:max-w-lg z-50 p-6 rounded-3xl bg-[#090E1C]/95 backdrop-blur-xl border border-white/[0.12] shadow-2xl space-y-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#C9A24B]/10 border border-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] shrink-0 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A24B] font-medium">
                  DPDP Act, 2023 Compliant
                </span>
                <span className="text-[11px] text-muted-text font-mono">· Privacy First</span>
              </div>
              <p className="text-xs text-slate-300 font-sans font-light leading-relaxed">
                Under India's Digital Personal Data Protection Act, we only collect essential telemetry and strictly safeguard your financial identity. Pure fiduciary confidentiality — zero data monetization.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/[0.06]">
            <Link
              to="/privacy"
              className="text-[11px] font-mono text-muted-text hover:text-[#C9A24B] transition-colors underline underline-offset-2"
            >
              Privacy Policy
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDecline}
                type="button"
                className="px-3.5 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
              >
                Essential Only
              </button>
              <Button
                onClick={handleAccept}
                size="sm"
                className="bg-[#C9A24B] hover:bg-[#d6af57] text-[#070B14] font-semibold text-xs rounded-xl px-4 py-2"
              >
                Accept All
              </Button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
