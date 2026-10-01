import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { StockTicker } from "@/components/StockTicker";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { CONTACT_CONFIG } from "@/constants/contactCopy";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  ArrowUpRight, 
  MessageCircle,
  CalendarCheck,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  Navigation,
  ExternalLink,
  Loader2,
  AlertTriangle
} from "lucide-react";

/**
 * Calculates current office operational status in Asia/Kolkata timezone
 */
function getOfficeStatus(): { isOpen: boolean; statusText: string; detail: string } {
  try {
    const now = new Date();
    const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const istDate = new Date(istString);
    const day = istDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const hour = istDate.getHours();
    const minute = istDate.getMinutes();
    const currentMins = hour * 60 + minute;

    // Weekdays (Mon - Fri): 9:00 AM (540m) to 6:00 PM (1080m)
    if (day >= 1 && day <= 5) {
      if (currentMins >= 540 && currentMins < 1080) {
        return {
          isOpen: true,
          statusText: "Open now",
          detail: "Desk active until 6:00 PM IST",
        };
      }
      return {
        isOpen: false,
        statusText: "Closed",
        detail: currentMins < 540 ? "Opens today at 9:00 AM IST" : "Reopens tomorrow at 9:00 AM IST",
      };
    }

    // Saturday: 10:00 AM (600m) to 2:00 PM (840m)
    if (day === 6) {
      if (currentMins >= 600 && currentMins < 840) {
        return {
          isOpen: true,
          statusText: "Open now",
          detail: "Desk active until 2:00 PM IST",
        };
      }
      return {
        isOpen: false,
        statusText: "Closed",
        detail: currentMins < 600 ? "Opens today at 10:00 AM IST" : "Reopens Monday at 9:00 AM IST",
      };
    }

    // Sunday: Closed (Pre-scheduled video slots only)
    return {
      isOpen: false,
      statusText: "Closed",
      detail: "Pre-scheduled video slots only · Reopens Mon 9:00 AM IST",
    };
  } catch (e) {
    return {
      isOpen: true,
      statusText: "Open now",
      detail: "Mon–Fri 9:00 AM – 6:00 PM IST",
    };
  }
}

export default function Contact() {
  const [activeTab, setActiveTab] = useState<"inquiry" | "booking">("inquiry");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [officeStatus, setOfficeStatus] = useState(getOfficeStatus());
  const [calIframeLoaded, setCalIframeLoaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const tabInquiryRef = useRef<HTMLButtonElement>(null);
  const tabBookingRef = useRef<HTMLButtonElement>(null);

  // Sync tab with URL hash (#inquiry, #book)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#book" || hash === "#booking" || hash === "#calendar") {
        setActiveTab("booking");
      } else if (hash === "#inquiry" || hash === "#form") {
        setActiveTab("inquiry");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setOfficeStatus(getOfficeStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const selectTab = (tab: "inquiry" | "booking") => {
    setActiveTab(tab);
    const hash = tab === "booking" ? "#book" : "#inquiry";
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  };

  // Keyboard navigation for accessible tablist
  const handleKeyDown = (e: React.KeyboardEvent, currentTab: "inquiry" | "booking") => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const nextTab = currentTab === "inquiry" ? "booking" : "inquiry";
      selectTab(nextTab);
      if (nextTab === "inquiry") tabInquiryRef.current?.focus();
      else tabBookingRef.current?.focus();
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F1E8] flex flex-col selection:bg-[#C9A24B]/30 selection:text-[#F5F1E8] overflow-x-clip">
      <Navbar />
      <StockTicker />

      <main className="flex-1">
        {/* Editorial Page Header with tightened bottom padding to reduce gap */}
        <section className="relative pt-20 pb-8 sm:pt-28 sm:pb-10 border-b border-white/[0.08] overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-[#C9A24B]/[0.04] rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-3xl space-y-4"
            >
              {/* Compliance Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A24B]/10 border border-[#C9A24B]/20 text-[10px] font-mono uppercase tracking-[0.25em] text-[#C9A24B]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="lining-nums">SEBI Registered Investment Adviser · {CONTACT_CONFIG.firm.sebiRiaNumber}</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F5F1E8] leading-[1.12]">
                Direct fiduciary access. <br />
                <span className="italic text-[#C9A24B]">Advisory desk in Pune.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-base sm:text-lg font-sans font-light max-w-2xl leading-relaxed pt-1">
                Whether you prefer an in-depth portfolio review, an in-person advisory meeting at our Chakan office, or a live scheduled video slot, our investment committee is at your disposal.
              </p>
            </motion.div>
          </div>
        </section>

        {/* TWO-COLUMN CONTACT & SCHEDULING SECTION (max-w-[1200px], 2-col CSS grid) */}
        <section className="py-12 lg:py-16">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              
              {/* ============================================================ */}
              {/* LEFT COLUMN: OFFICE DETAILS & ADVISORY COMMITMENTS           */}
              {/* Desktop: sticky top-24. Mobile: order-1 and order-4          */}
              {/* ============================================================ */}
              <div className="contents lg:flex lg:flex-col lg:gap-8 lg:sticky lg:top-24">
                
                {/* Card 1: Office Details Card */}
                <div className="order-1 lg:order-none w-full p-6 lg:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-6 shadow-xl relative overflow-hidden">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A24B] block">
                        {CONTACT_CONFIG.office.label}
                      </span>
                      <h2 className="font-serif text-2xl text-[#F5F1E8] font-normal">
                        {CONTACT_CONFIG.firm.brandName}
                      </h2>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-[#C9A24B]/10 border border-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Address Block with consistent 4-line visual hierarchy */}
                  <div className="flex items-start gap-4 text-slate-300 font-sans">
                    <div className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#C9A24B] shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-left flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#F5F1E8] leading-snug">
                        Shop no 2, First Floor, Mahalungeker Complex
                      </p>
                      <p className="text-xs text-slate-400 leading-snug">
                        Opposite R K Wine Shop · Mahalunge Ingale Kaman
                      </p>
                      <p className="text-sm font-normal text-[#F5F1E8] leading-snug">
                        Chakan-Talegaon Highway, Chakan
                      </p>
                      <p className="text-xs text-slate-400 lining-nums leading-snug">
                        Pune, Maharashtra 410501
                      </p>
                    </div>
                  </div>

                  {/* Direct Contact Links & Working Hours Rows */}
                  <div className="pt-2">
                    
                    {/* Row 1: Direct Line (Single Phone Number) */}
                    <div className="flex items-center justify-between gap-4 py-4 border-t border-white/[0.08]">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#C9A24B] shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 block">
                            DIRECT LINE
                          </span>
                          <a
                            href={`tel:${CONTACT_CONFIG.firm.primaryPhoneRaw}`}
                            className="text-sm font-medium text-[#F5F1E8] hover:text-[#C9A24B] transition-colors lining-nums truncate block focus:outline-none focus:underline"
                          >
                            {CONTACT_CONFIG.firm.primaryPhone}
                          </a>
                        </div>
                      </div>

                      {/* Copy phone button: 36px hit area */}
                      <button
                        type="button"
                        onClick={() => copyToClipboard(CONTACT_CONFIG.firm.primaryPhone, "phone")}
                        aria-label="Copy phone number to clipboard"
                        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-transparent hover:border-white/[0.1] text-slate-400 hover:text-[#F5F1E8] transition-all cursor-pointer"
                      >
                        {copiedKey === "phone" ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Row 2: Advisory Desk Email */}
                    <div className="flex items-center justify-between gap-4 py-4 border-t border-white/[0.08]">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#C9A24B] shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 block">
                            ADVISORY DESK EMAIL
                          </span>
                          <a
                            href={`mailto:${CONTACT_CONFIG.firm.officialEmail}`}
                            className="text-sm font-medium text-[#F5F1E8] hover:text-[#C9A24B] transition-colors truncate block focus:outline-none focus:underline"
                          >
                            {CONTACT_CONFIG.firm.officialEmail}
                          </a>
                        </div>
                      </div>

                      {/* Copy email button: 36px hit area */}
                      <button
                        type="button"
                        onClick={() => copyToClipboard(CONTACT_CONFIG.firm.officialEmail, "email")}
                        aria-label="Copy email address to clipboard"
                        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-white/[0.02] hover:bg-white/[0.08] border border-transparent hover:border-white/[0.1] text-slate-400 hover:text-[#F5F1E8] transition-all cursor-pointer"
                      >
                        {copiedKey === "email" ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Row 3: WhatsApp Desk */}
                    <div className="flex items-center justify-between gap-4 py-4 border-t border-white/[0.08]">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-400 block">
                            WHATSAPP DESK
                          </span>
                          <a
                            href={`https://wa.me/${CONTACT_CONFIG.firm.whatsAppRaw}?text=${encodeURIComponent(
                              CONTACT_CONFIG.firm.whatsAppPrefilledText
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-[#F5F1E8] hover:text-emerald-400 transition-colors lining-nums truncate block focus:outline-none focus:underline"
                          >
                            {CONTACT_CONFIG.firm.whatsAppNumber} (Instant Query)
                          </a>
                        </div>
                      </div>

                      {/* Open WhatsApp External link: 36px hit area */}
                      <a
                        href={`https://wa.me/${CONTACT_CONFIG.firm.whatsAppRaw}?text=${encodeURIComponent(
                          CONTACT_CONFIG.firm.whatsAppPrefilledText
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open WhatsApp conversation"
                        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-transparent hover:border-emerald-500/30 text-emerald-400 transition-all cursor-pointer"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Row 4: Working Hours with Live Status Pill and 2-column Table */}
                    <div className="flex items-start gap-4 py-4 border-t border-white/[0.08]">
                      <div className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#C9A24B] shrink-0 mt-0.5">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Label and live status pill on the same row */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 block">
                            OFFICE WORKING HOURS
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                              officeStatus.isOpen
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                officeStatus.isOpen ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                              }`}
                            />
                            <span>{officeStatus.statusText}</span>
                          </span>
                        </div>

                        {/* Clean Two-Column List for Hours */}
                        <div className="mt-3 space-y-2 text-xs font-sans">
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-[#F5F1E8]">Mon – Fri</span>
                            <span className="text-slate-300 font-light lining-nums text-right">9:00 AM – 6:00 PM IST</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-[#F5F1E8]">Saturday</span>
                            <span className="text-slate-300 font-light lining-nums text-right">10:00 AM – 2:00 PM IST</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-slate-400">Sunday</span>
                            <span className="text-slate-400 font-light text-right">Closed · Pre-scheduled video slots only</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Card 2: Advisory Commitments Card */}
                <div className="order-4 lg:order-none w-full p-6 lg:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] shadow-xl space-y-4">
                  <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-[#C9A24B]">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A24B] shrink-0" />
                    <span className="font-medium">{CONTACT_CONFIG.commitments.boxTitle}</span>
                  </div>
                  <ul className="text-xs text-slate-300 font-sans font-light space-y-2.5 leading-relaxed">
                    {CONTACT_CONFIG.commitments.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-[#C9A24B] shrink-0 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* ============================================================ */}
              {/* RIGHT COLUMN: LOCATION MAP & INQUIRY / VIDEO SLOT FORM       */}
              {/* Mobile: order-2 (map) and order-3 (form)                     */}
              {/* ============================================================ */}
              <div className="contents lg:flex lg:flex-col lg:gap-8">
                
                {/* Card 3: Location Map Frame */}
                <div className="order-2 lg:order-none w-full p-6 lg:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-5 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A24B]">
                      Office Geo-Location
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 lining-nums truncate max-w-[200px] sm:max-w-none">
                      {CONTACT_CONFIG.office.coordinates.display}
                    </span>
                  </div>

                  {/* Fixed Aspect Ratio / 320px Frame with rounded-2xl corners without duplicate overlay */}
                  <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[320px] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#02050b] shadow-inner">
                    <iframe
                      src={CONTACT_CONFIG.office.googleMapsEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Alpha Investment Management Pune Advisory Office Location Map"
                      onLoad={() => setMapLoaded(true)}
                      className="w-full h-full filter invert-[90%] hue-rotate-180 contrast-[110%] opacity-90 transition-opacity duration-300"
                    />
                  </div>

                  {/* Map Buttons: side-by-side equal width, h-12, rounded-xl, icons aligned right, no wrapping */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <a
                      href={CONTACT_CONFIG.office.googleMapsViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-full flex items-center justify-between px-3 sm:px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] hover:border-[#C9A24B]/30 text-[11px] sm:text-xs font-sans font-medium text-[#F5F1E8] hover:text-[#C9A24B] transition-all whitespace-nowrap"
                    >
                      <span className="truncate">Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5" />
                    </a>

                    <a
                      href={CONTACT_CONFIG.office.googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-full flex items-center justify-between px-3 sm:px-4 rounded-xl bg-[#C9A24B] hover:bg-[#d6af57] text-[#070B14] font-sans font-semibold text-[11px] sm:text-xs transition-all shadow-lg hover:shadow-[#C9A24B]/20 whitespace-nowrap"
                    >
                      <span className="truncate">Get Directions</span>
                      <Navigation className="w-3.5 h-3.5 text-[#070B14] shrink-0 ml-1.5" />
                    </a>
                  </div>
                </div>

                {/* Card 4: Inquiry / Video Slot Form Card */}
                <div className="order-3 lg:order-none w-full p-6 lg:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] shadow-xl space-y-6">
                  {/* W3C ARIA Tablist switcher: inside the form card at the top */}
                  <div
                    role="tablist"
                    aria-label="Advisory Contact Options"
                    className="flex items-center justify-between p-1.5 rounded-2xl bg-[#070B14] border border-white/[0.08]"
                  >
                    <button
                      ref={tabInquiryRef}
                      id="tab-inquiry"
                      role="tab"
                      type="button"
                      aria-selected={activeTab === "inquiry"}
                      aria-controls="panel-inquiry"
                      tabIndex={activeTab === "inquiry" ? 0 : -1}
                      onClick={() => selectTab("inquiry")}
                      onKeyDown={(e) => handleKeyDown(e, "inquiry")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-sans transition-all duration-200 cursor-pointer ${
                        activeTab === "inquiry"
                          ? "bg-[#C9A24B] text-[#070B14] shadow-md font-semibold"
                          : "text-slate-300 hover:text-[#F5F1E8] hover:bg-white/[0.04] font-medium"
                      }`}
                    >
                      <span>{CONTACT_CONFIG.tabs.inquiry.label}</span>
                    </button>

                    <button
                      ref={tabBookingRef}
                      id="tab-booking"
                      role="tab"
                      type="button"
                      aria-selected={activeTab === "booking"}
                      aria-controls="panel-booking"
                      tabIndex={activeTab === "booking" ? 0 : -1}
                      onClick={() => selectTab("booking")}
                      onKeyDown={(e) => handleKeyDown(e, "booking")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-sans transition-all duration-200 cursor-pointer ${
                        activeTab === "booking"
                          ? "bg-[#C9A24B] text-[#070B14] shadow-md font-semibold"
                          : "text-slate-300 hover:text-[#F5F1E8] hover:bg-white/[0.04] font-medium"
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{CONTACT_CONFIG.tabs.booking.label}</span>
                    </button>
                  </div>

                  {/* TAB PANEL 1: SEND AN INQUIRY FORM */}
                  <div
                    id="panel-inquiry"
                    role="tabpanel"
                    aria-labelledby="tab-inquiry"
                    hidden={activeTab !== "inquiry"}
                    className={activeTab === "inquiry" ? "space-y-6 block" : "hidden"}
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A24B]">
                        Confidential Inquiry
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-normal">
                        {CONTACT_CONFIG.formCopy.heading}
                      </h2>
                      <p className="text-slate-300 text-xs sm:text-sm font-sans font-light leading-relaxed">
                        {CONTACT_CONFIG.formCopy.subheading}
                      </p>
                    </div>

                    <div className="pt-2">
                      <ContactForm />
                    </div>
                  </div>

                  {/* TAB PANEL 2: BOOK A VIDEO SLOT (CAL.COM EMBED + FALLBACK) */}
                  <div
                    id="panel-booking"
                    role="tabpanel"
                    aria-labelledby="tab-booking"
                    hidden={activeTab !== "booking"}
                    className={activeTab === "booking" ? "space-y-6 block" : "hidden"}
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A24B]">
                        Real-Time Scheduling
                      </span>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-normal flex items-center gap-2">
                          <span>Book an Advisory Slot</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C9A24B]/15 text-[#C9A24B] font-mono font-medium lining-nums">
                            30 Min
                          </span>
                        </h2>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Calendar Sync
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs sm:text-sm font-sans font-light leading-relaxed">
                        Select a dedicated 30-minute introductory session via Google Meet or a phone conference with a SEBI-registered advisor.
                      </p>
                    </div>

                    {/* Booking Container with Embed & Fallback Links */}
                    <div className="rounded-2xl border border-white/[0.12] bg-[#070B14] p-5 sm:p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#C9A24B]/10 border border-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] shrink-0">
                            <CalendarCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-[#F5F1E8]">Introductory Wealth Consultation</h3>
                            <p className="text-xs text-slate-400 font-mono">30 mins · Google Meet / Phone · Free</p>
                          </div>
                        </div>
                      </div>

                      {/* Cal.com Iframe with Loader & Fallback */}
                      <div className="relative min-h-[460px] rounded-xl overflow-hidden bg-black/40 border border-white/[0.08]">
                        {!calIframeLoaded && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-10 bg-[#070B14]">
                            <Loader2 className="w-6 h-6 animate-spin text-[#C9A24B]" />
                            <p className="text-xs font-mono text-slate-400">Connecting to scheduling calendar...</p>
                          </div>
                        )}
                        <iframe
                          src="https://cal.com/alpha-aim/30min?embed=true"
                          title="Schedule Advisory Consultation on Cal.com"
                          loading="lazy"
                          onLoad={() => setCalIframeLoaded(true)}
                          className="w-full h-[500px] border-0"
                        />
                      </div>

                      {/* Direct External Calendar Fallback Button */}
                      <div className="pt-1 text-center space-y-3">
                        <a
                          href={CONTACT_CONFIG.calendar.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[44px] inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-[#C9A24B] hover:bg-[#d6af57] text-[#070B14] font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-200 shadow-xl hover:shadow-[#C9A24B]/20"
                        >
                          <span>Open Full Calendar in New Tab</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Meeting invitations and Google Meet links automatically sync to your calendar.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Regulatory Disclosure below Form Card */}
                <div className="order-3 lg:order-none p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-slate-400 font-sans font-light leading-relaxed">
                  {CONTACT_CONFIG.formCopy.statutoryFooter}
                </div>

              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
