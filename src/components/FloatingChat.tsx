import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingChat() {
  const whatsappUrl =
    "https://wa.me/919607509586?text=Hi%2C%20I%20would%20like%20to%20consult%20an%20Alpha%20Investment%20Management%20fiduciary%20advisor.";

  return (
    <aside aria-label="Quick Actions" className="fixed bottom-6 right-6 z-50">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-11 h-11 rounded-full bg-[#070B14] border border-[#C9A24B]/30 hover:border-[#C9A24B]/70 flex items-center justify-center text-[#C9A24B] shadow-2xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B]"
      >
        <MessageCircle className="w-5 h-5 text-[#C9A24B]" />
      </motion.a>
    </aside>
  );
}