"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { MagneticButton } from "@/components/motion/magnetic-button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    capital: "1Cr-5Cr",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="w-full bg-ink text-ivory">
      {/* Editorial Header */}
      <section className="pt-40 pb-20 border-b border-white/[0.06] relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
              Private Office
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight">
              Initiate a confidential dialogue.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl font-sans">
              Our partners engage directly with each prospective client family. Inquiries are reviewed under strict professional non-disclosure.
            </p>
          </div>
        </div>
      </section>

      {/* Main Engagement Grid */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left: Pune Headquarters & Office Details */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
                  Headquarters
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-ivory font-normal">
                  Pune, Maharashtra
                </h2>
                <p className="text-sm text-slate-300/80 leading-relaxed font-sans font-light">
                  Alpha Investment Management operates its primary client advisory desk from Pune, serving families across western India and international NRIs.
                </p>
              </div>

              <div className="space-y-6 text-sm text-slate-300 font-sans">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-ink-light border-hairline-dark">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                      Physical Address
                    </span>
                    <p className="text-xs leading-relaxed text-slate-200">
                      Shop No 2, 1st Floor, Mahalungeker Complex,
                      <br />
                      Opposite R K Wine Shop, Mahalunge Ingale Kaman,
                      <br />
                      Chakan-Talegaon Highway, Chakan,
                      <br />
                      Pune, Maharashtra 410501
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-ink-light border-hairline-dark">
                  <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                      Direct Advisory Line
                    </span>
                    <a
                      href="tel:+919607509586"
                      className="text-xs text-slate-200 hover:text-gold transition-colors"
                    >
                      +91 96075 09586
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-ink-light border-hairline-dark">
                  <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                      Electronic Inquiries
                    </span>
                    <a
                      href="mailto:alphainvestmentmnt@gmail.com"
                      className="text-xs text-slate-200 hover:text-gold transition-colors"
                    >
                      alphainvestmentmnt@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-ink-light border-hairline-dark">
                  <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                      Advisory Desk Hours
                    </span>
                    <p className="text-xs leading-relaxed text-slate-300">
                      Monday through Friday: 9:00 AM – 6:00 PM IST
                      <br />
                      Saturday: 10:00 AM – 2:00 PM IST
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border-hairline-dark bg-ink-light/40 space-y-3">
                <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>SEBI Regulatory Oversight</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  All communications and advisory agreements are compliant with the SEBI (Investment Advisers) Regulations, 2013 and verified under BASL supervisory frameworks.
                </p>
              </div>
            </div>

            {/* Right: Consultation Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-12 rounded-3xl bg-ivory text-ink space-y-6 shadow-2xl">
                <div>
                  <span className="text-xs uppercase tracking-widest text-gold font-medium font-sans">
                    Private Engagement Form
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
                    Schedule Private Consultation
                  </h3>
                  <p className="text-xs text-slate-600 font-sans mt-2">
                    Please provide an overview of your requirements. A senior partner will contact you directly within one business day.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-ivory-subtle border-hairline-light space-y-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-gold/15 text-gold mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-gold" />
                    </div>
                    <h4 className="font-serif text-2xl text-ink font-normal">
                      Inquiry Received Under Confidential Protocol
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans max-w-md mx-auto">
                      Thank you. Your submission has been routed directly to the investment committee. We will reach out to schedule your introductory discussion.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                    <div className="space-y-1.5">
                      <label className="text-slate-700 uppercase tracking-wider text-[10px] font-semibold">
                        Principal Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul S. Kulkarni"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-ink focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-700 uppercase tracking-wider text-[10px] font-semibold">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="rahul@enterprise.in"
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-ink focus:border-gold focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-700 uppercase tracking-wider text-[10px] font-semibold">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98220 00000"
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-ink focus:border-gold focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 uppercase tracking-wider text-[10px] font-semibold">
                        Estimated Capital Under Consideration
                      </label>
                      <select
                        value={formData.capital}
                        onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-ink focus:border-gold focus:outline-none transition-colors"
                      >
                        <option value="50L-1Cr">₹50 Lakhs – ₹1 Crore</option>
                        <option value="1Cr-5Cr">₹1 Crore – ₹5 Crores</option>
                        <option value="5Cr-25Cr">₹5 Crores – ₹25 Crores</option>
                        <option value="25Cr+">₹25 Crores+ (Multi-Family Office / Corporate)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 uppercase tracking-wider text-[10px] font-semibold">
                        Primary Advisory Focus
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please share any specific objectives (e.g. portfolio restructuring, trust formation, business exit liquidity, or capital preservation)..."
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-ink focus:border-gold focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-ink hover:bg-ink-light text-ivory font-semibold uppercase tracking-wider text-xs py-4 rounded-xl transition-all duration-300 shadow-lg active:scale-[0.99]"
                      >
                        Submit Confidential Inquiry
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                      Your details are held in strictest confidence pursuant to SEBI client data governance rules.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
