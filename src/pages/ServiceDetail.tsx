import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  ShieldCheck, 
  Calendar, 
  PhoneCall, 
  Mail, 
  Clock, 
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { servicesData, ServiceItem } from "@/data/servicesData";
import { Button } from "@/components/ui/button";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const service = servicesData.find((s) => s.slug === slug);

  // If slug is invalid, fallback gracefully to first service or redirect
  if (!service) {
    return <Navigate to="/services" replace />;
  }

  // Find next service for bottom navigation
  const currentIndex = servicesData.findIndex((s) => s.slug === service.slug);
  const nextService = servicesData[(currentIndex + 1) % servicesData.length];
  const prevService = servicesData[(currentIndex - 1 + servicesData.length) % servicesData.length];

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F1E8] selection:bg-[#C9A24B]/30 selection:text-[#F5F1E8] overflow-x-hidden">
      <Navbar />

      <main>
        {/* Editorial Hero Header */}
        <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden border-b border-white/[0.08]">
          {/* Cinematic Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={service.heroImage}
              alt={service.title}
              className="w-full h-full object-cover object-center filter grayscale contrast-[1.1] opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/85 to-[#070B14]/75" />
          </div>

          <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl relative z-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-slate-400 mb-8">
              <Link to="/services" className="hover:text-[#C9A24B] transition-colors flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Capabilities</span>
              </Link>
              <span>/</span>
              <span className="text-[#C9A24B]">{service.number}</span>
            </div>

            <div className="max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A24B]/10 border border-[#C9A24B]/20 text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A24B]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SEBI Fiduciary Practice · INA000017348</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[64px] font-normal leading-[1.08] tracking-tight text-[#F5F1E8]">
                {service.title}
              </h1>

              <p className="text-base sm:text-xl text-slate-300 font-sans font-light leading-relaxed max-w-3xl">
                {service.fullDesc}
              </p>
            </div>
          </div>
        </section>

        {/* Two-Column Detail Layout: Content Left, Sticky Consultation CTA Right */}
        <section className="py-20 sm:py-28 relative">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* LEFT COLUMN: Key Benefits, 5-Step Stepper & FAQs */}
              <div className="lg:col-span-8 space-y-24">
                
                {/* 1. Key Benefits */}
                <div className="space-y-8">
                  <div className="space-y-2 pb-4 border-b border-white/[0.08]">
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C9A24B] block font-semibold">
                      Institutional Value
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F1E8] font-normal tracking-tight">
                      Key Client Benefits
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {service.keyBenefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-2xl bg-[#090E1C] border border-white/[0.08] hover:border-[#C9A24B]/35 transition-colors flex items-start gap-4 group"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#C9A24B]/10 border border-[#C9A24B]/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#C9A24B] group-hover:text-[#070B14] transition-colors text-[#C9A24B]">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 font-sans font-light leading-relaxed">
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Our Process: 5-Step Vertical Stepper */}
                <div className="space-y-10">
                  <div className="space-y-2 pb-4 border-b border-white/[0.08]">
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C9A24B] block font-semibold">
                      Advisory Methodology
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F1E8] font-normal tracking-tight">
                      Our 5-Step Execution Process
                    </h2>
                  </div>

                  <div className="relative pl-6 sm:pl-10 space-y-10">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[17px] sm:left-[25px] top-6 bottom-6 w-[1.5px] bg-gradient-to-b from-[#C9A24B] via-[#C9A24B]/40 to-white/10" />

                    {service.process.map((stepItem, idx) => (
                      <motion.div
                        key={stepItem.step}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.08, duration: 0.5 }}
                        className="relative flex items-start gap-6 group"
                      >
                        {/* Step Number Badge */}
                        <div className="absolute -left-[32px] sm:-left-[44px] top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#070B14] border-2 border-[#C9A24B] flex items-center justify-center text-xs sm:text-sm font-mono font-bold text-[#C9A24B] shadow-[0_0_15px_rgba(201,162,75,0.2)] group-hover:bg-[#C9A24B] group-hover:text-[#070B14] transition-colors z-10">
                          0{stepItem.step}
                        </div>

                        {/* Step Content Card */}
                        <div className="p-6 sm:p-8 rounded-2xl bg-[#090E1C] border border-white/[0.08] group-hover:border-[#C9A24B]/40 transition-all duration-300 w-full shadow-lg">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#F5F1E8] group-hover:text-[#C9A24B] transition-colors">
                              {stepItem.title}
                            </h3>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                              Phase 0{stepItem.step}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 font-sans font-light leading-relaxed">
                            {stepItem.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 3. Frequently Asked Questions (FAQs) */}
                <div className="space-y-8">
                  <div className="space-y-2 pb-4 border-b border-white/[0.08]">
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C9A24B] block font-semibold">
                      Governance &amp; Transparency
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F1E8] font-normal tracking-tight">
                      Frequently Asked Questions
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {service.faqs.map((faq, index) => {
                      const isOpen = openFaqIndex === index;
                      return (
                        <div
                          key={index}
                          className="rounded-2xl border border-white/[0.08] bg-[#090E1C] overflow-hidden transition-all duration-300"
                        >
                          <button
                            onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                            className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 group"
                          >
                            <span className="font-serif text-base sm:text-lg text-[#F5F1E8] group-hover:text-[#C9A24B] transition-colors">
                              {faq.question}
                            </span>
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-[#C9A24B] group-hover:border-[#C9A24B]/40 transition-colors">
                              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#C9A24B]" : ""}`} />
                            </div>
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-xs sm:text-sm text-slate-300 font-sans font-light leading-relaxed border-t border-white/[0.06] pt-4">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Pagination Links between Services */}
                <div className="pt-10 border-t border-white/[0.08] flex items-center justify-between gap-4">
                  <Link
                    to={`/services/${prevService.slug}`}
                    className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-[#C9A24B] transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#C9A24B] transition-transform group-hover:-translate-x-1" />
                    <span>Prev: {prevService.title}</span>
                  </Link>
                  <Link
                    to={`/services/${nextService.slug}`}
                    className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-[#C9A24B] transition-colors group text-right"
                  >
                    <span>Next: {nextService.title}</span>
                    <ArrowRight className="w-4 h-4 text-[#C9A24B] transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

              </div>

              {/* RIGHT COLUMN: Sticky "Book a Consultation" Card */}
              <div className="lg:col-span-4 sticky top-28 space-y-6">
                <div className="p-8 sm:p-9 rounded-3xl bg-[#090E1C] border border-[#C9A24B]/30 shadow-2xl relative overflow-hidden group">
                  {/* Subtle ambient gold background glow */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C9A24B] block font-semibold">
                        Direct Fiduciary Access
                      </span>
                      <h3 className="font-serif text-2xl text-[#F5F1E8] font-normal leading-tight">
                        Book a Consultation
                      </h3>
                      <p className="text-xs text-slate-300 font-sans font-light leading-relaxed">
                        Schedule a confidential 45-minute portfolio consultation with our SEBI Registered Advisory team in Pune.
                      </p>
                    </div>

                    {/* Consultation Perks */}
                    <ul className="space-y-3 pt-4 border-t border-white/[0.08] text-xs text-slate-300 font-sans font-light">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A24B] shrink-0" />
                        <span>Zero sales pitch or commission products</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A24B] shrink-0" />
                        <span>Detailed portfolio health &amp; asset allocation audit</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A24B] shrink-0" />
                        <span>100% confidential &amp; conflict-free advice</span>
                      </li>
                    </ul>

                    {/* Primary Button */}
                    <div className="pt-2">
                      <Button
                        asChild
                        className="w-full bg-[#C9A24B] hover:bg-[#d6af57] text-[#070B14] font-sans font-semibold text-xs tracking-wider uppercase py-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#C9A24B]/20"
                      >
                        <Link to="/contact" className="inline-flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Reserve Time with Advisor</span>
                        </Link>
                      </Button>
                    </div>

                    {/* Direct Contact Info */}
                    <div className="pt-4 border-t border-white/[0.08] space-y-2.5 text-xs text-slate-400 font-sans">
                      <div className="flex items-center gap-2.5">
                        <PhoneCall className="w-3.5 h-3.5 text-[#C9A24B]" />
                        <a href="tel:+919607509586" className="hover:text-[#F5F1E8] transition-colors">
                          +91 96075 09586
                        </a>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-3.5 h-3.5 text-[#C9A24B]" />
                        <a href="mailto:info@alphaaim.in" className="hover:text-[#F5F1E8] transition-colors">
                          info@alphaaim.in
                        </a>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-3.5 h-3.5 text-[#C9A24B]" />
                        <span>Mon – Sat: 9:30 AM – 6:30 PM IST</span>
                      </div>
                    </div>

                    {/* Regulatory Notice */}
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono text-slate-400">
                      SEBI RIA Reg: <span className="text-[#F5F1E8]">INA000017348</span> · BASL Member
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Sticky Bottom Action for Mobile Viewports */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070B14]/95 backdrop-blur-xl border-t border-white/[0.1] p-4 flex items-center justify-between gap-4 shadow-2xl">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B]">Advisory Booking</p>
          <p className="text-xs font-serif text-[#F5F1E8]">{service.title}</p>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-[#C9A24B] hover:bg-[#d6af57] text-[#070B14] font-semibold text-xs px-5 py-2.5 rounded-lg"
        >
          <Link to="/contact">Book Consultation</Link>
        </Button>
      </div>

      <Footer />
    </div>
  );
}
