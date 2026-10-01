import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass, Calculator, Phone, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Non-existent route requested:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F1E8] flex flex-col selection:bg-[#C9A24B]/30 selection:text-[#F5F1E8] overflow-x-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-28 sm:py-36 px-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C9A24B]/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C9A24B] px-3.5 py-1.5 rounded-full bg-[#C9A24B]/10 border border-[#C9A24B]/20 inline-block">
              Error 404 · Navigation Unmapped
            </span>

            <h1 className="font-serif text-6xl sm:text-8xl font-normal tracking-tight text-[#F5F1E8]">
              404
            </h1>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-normal">
              This financial corridor does not exist.
            </h2>

            <p className="text-sm sm:text-base text-slate-400 font-sans font-light max-w-md mx-auto leading-relaxed">
              The page or statutory report at <code className="text-[#C9A24B] text-xs font-mono">{location.pathname}</code> has been archived or relocated. Choose a primary fiduciary portal below:
            </p>
          </motion.div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <Link
              to="/"
              className="p-4 rounded-2xl bg-[#090E1C] border border-white/[0.08] hover:border-[#C9A24B]/40 transition-colors group flex flex-col items-center gap-2"
            >
              <Home className="w-5 h-5 text-[#C9A24B]" />
              <span className="text-xs font-sans text-slate-300 group-hover:text-white">Home</span>
            </Link>

            <Link
              to="/calculators"
              className="p-4 rounded-2xl bg-[#090E1C] border border-white/[0.08] hover:border-[#C9A24B]/40 transition-colors group flex flex-col items-center gap-2"
            >
              <Calculator className="w-5 h-5 text-[#C9A24B]" />
              <span className="text-xs font-sans text-slate-300 group-hover:text-white">Calculators</span>
            </Link>

            <Link
              to="/risk-profile"
              className="p-4 rounded-2xl bg-[#090E1C] border border-white/[0.08] hover:border-[#C9A24B]/40 transition-colors group flex flex-col items-center gap-2"
            >
              <Compass className="w-5 h-5 text-[#C9A24B]" />
              <span className="text-xs font-sans text-slate-300 group-hover:text-white">Risk Profile</span>
            </Link>

            <Link
              to="/contact"
              className="p-4 rounded-2xl bg-[#090E1C] border border-white/[0.08] hover:border-[#C9A24B]/40 transition-colors group flex flex-col items-center gap-2"
            >
              <Phone className="w-5 h-5 text-[#C9A24B]" />
              <span className="text-xs font-sans text-slate-300 group-hover:text-white">Advisory Desk</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
