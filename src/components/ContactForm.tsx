import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  MessageCircle,
  Phone,
  Lock,
  ChevronDown,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitContactInquiry, ContactPayload } from "@/api/email";
import { CONTACT_CONFIG } from "@/constants/contactCopy";
import { Link } from "react-router-dom";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  goal?: string;
  message?: string;
  consent?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactPayload>({
    name: "",
    email: "",
    phone: "",
    goal: CONTACT_CONFIG.advisoryObjectives[0],
    message: "",
    honeypot: "",
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);

  // Measure form interaction time to prevent automated instant bots
  const formStartTimeRef = useRef<number>(Date.now());
  useEffect(() => {
    formStartTimeRef.current = Date.now();
  }, []);

  // Field element refs for focusing the first invalid input
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const goalRef = useRef<HTMLSelectElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  // Phone cleaner & validator for Indian 10-digit mobile
  const sanitizeIndianPhone = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, "");
    if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
    return digits;
  };

  // Field validator
  const validateField = (fieldName: string, value: any): string | undefined => {
    switch (fieldName) {
      case "name": {
        const trimmed = (value || "").trim();
        if (!trimmed) return "Full legal name is required.";
        if (trimmed.length < 2) return "Please enter at least 2 characters.";
        if (trimmed.length > 100) return "Name cannot exceed 100 characters.";
        return undefined;
      }
      case "email": {
        const trimmed = (value || "").trim();
        if (!trimmed) return "Email address is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
        return undefined;
      }
      case "phone": {
        const clean = sanitizeIndianPhone(value || "");
        if (!clean) return "Contact phone number is required.";
        if (!/^[6-9]\d{9}$/.test(clean)) {
          return "Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).";
        }
        return undefined;
      }
      case "goal": {
        if (!value || String(value).trim().length === 0) {
          return "Please select a primary advisory objective.";
        }
        return undefined;
      }
      case "message": {
        if (value && value.length > 1000) {
          return "Message cannot exceed 1,000 characters.";
        }
        return undefined;
      }
      case "consent": {
        if (!value) return "You must consent to proceed with fiduciary contact.";
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, (formData as any)[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    setServerError(null);

    if (touched[name]) {
      const error = validateField(name, finalValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate all fields
    const newErrors: FormErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
      goal: validateField("goal", formData.goal),
      message: validateField("message", formData.message),
      consent: validateField("consent", formData.consent),
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      goal: true,
      message: true,
      consent: true,
    });

    // Focus the first invalid field
    if (newErrors.name) {
      nameRef.current?.focus();
      return;
    }
    if (newErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (newErrors.phone) {
      phoneRef.current?.focus();
      return;
    }
    if (newErrors.goal) {
      goalRef.current?.focus();
      return;
    }
    if (newErrors.consent) {
      consentRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: ContactPayload = {
        ...formData,
        formStartTime: formStartTimeRef.current,
      };

      const res = await submitContactInquiry(payload);
      setRefNumber(res.refNumber || `AIM-${Date.now().toString().slice(-6)}`);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Submission failed:", err);
      if (err.fieldErrors) {
        setErrors((prev) => ({ ...prev, ...err.fieldErrors }));
      }
      setServerError(
        err.message ||
          "Unable to transmit your request to our advisory desk. Please retry or contact us directly via WhatsApp / phone below."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      goal: CONTACT_CONFIG.advisoryObjectives[0],
      message: "",
      honeypot: "",
      consent: false,
    });
    setErrors({});
    setTouched({});
    setServerError(null);
    setIsSuccess(false);
    formStartTimeRef.current = Date.now();
  };

  const charsCount = formData.message?.length || 0;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          /* ================= SUCCESS PANEL ================= */
          <motion.div
            key="success-state"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-8 sm:p-10 rounded-2xl bg-[#090E1C] border border-[#C9A24B]/30 shadow-2xl text-center space-y-6"
          >
            {/* Animated SVG Checkmark / Tick */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#C9A24B]/10 flex items-center justify-center border border-[#C9A24B]/30">
                <CheckCircle2 className="w-8 h-8 text-[#C9A24B]" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C9A24B] font-semibold block lining-nums">
                Reference ID: #{refNumber}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-normal tracking-tight">
                {CONTACT_CONFIG.formCopy.successHeadline}
              </h3>
              <p className="text-slate-300 text-sm font-sans font-light max-w-md mx-auto leading-relaxed pt-1">
                Thank you, <strong className="text-[#F5F1E8] font-medium">{formData.name}</strong>.{" "}
                {CONTACT_CONFIG.formCopy.successMessage}
              </p>
            </div>

            {/* Fiduciary Confirmation Summary */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] max-w-md mx-auto text-left space-y-2 text-xs font-mono text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Direct Contact:</span>
                <span className="text-[#F5F1E8] lining-nums">{formData.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email Address:</span>
                <span className="text-[#F5F1E8] truncate max-w-[200px]">{formData.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Advisory Objective:</span>
                <span className="text-[#C9A24B] truncate max-w-[220px]">{formData.goal}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.08] text-[10px] text-slate-400">
                <span>SEBI Registration:</span>
                <span className="lining-nums">{CONTACT_CONFIG.firm.sebiRiaNumber}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-white/10 hover:border-[#C9A24B]/40 hover:bg-[#C9A24B]/10 text-xs px-6 py-5 rounded-xl text-[#F5F1E8] transition-colors"
              >
                Send Another Inquiry
              </Button>
            </div>
          </motion.div>
        ) : (
          /* ================= INQUIRY FORM ================= */
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Server Error Alert with Retry & Instant WhatsApp / Call fallback */}
            {serverError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="font-light leading-relaxed">{serverError}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 font-mono text-[11px] transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retry Submission</span>
                  </button>
                  <a
                    href={`https://wa.me/${CONTACT_CONFIG.firm.whatsAppRaw}?text=${encodeURIComponent(
                      `Hi Alpha AIM desk, my name is ${formData.name || "Client"}. Inquiring regarding: ${formData.goal}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-mono text-[11px] transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Send via WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${CONTACT_CONFIG.firm.primaryPhoneRaw}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 font-mono text-[11px] transition-colors lining-nums"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Advisory Desk</span>
                  </a>
                </div>
              </div>
            )}

            {/* Honeypot Spam Protection (Hidden from sighted users and screen readers) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website_hp">Leave this empty</label>
              <input
                id="website_hp"
                type="text"
                name="honeypot"
                tabIndex={-1}
                autoComplete="off"
                value={formData.honeypot}
                onChange={handleChange}
              />
            </div>

            {/* Field 1: Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-name"
                className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-300 block"
              >
                Full Legal Name <span className="text-[#C9A24B]">*</span>
              </label>
              <input
                ref={nameRef}
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Vikramaditya Singhania"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur("name")}
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`w-full h-12 px-4 rounded-xl bg-white/[0.03] border ${
                  errors.name
                    ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20"
                    : "border-white/15 focus:border-[#C9A24B] focus:ring-[#C9A24B]/30"
                } text-sm sm:text-base text-[#F5F1E8] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all font-sans`}
              />
              {errors.name && (
                <p
                  id="name-error"
                  role="alert"
                  className="text-xs text-rose-400 flex items-center gap-1.5 pt-0.5 font-sans font-light"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Field 2 & 3: Email & Phone Grid (side by side on desktop, stacked on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-email"
                  className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-300 block"
                >
                  Email Address <span className="text-[#C9A24B]">*</span>
                </label>
                <input
                  ref={emailRef}
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full h-12 px-4 rounded-xl bg-white/[0.03] border ${
                    errors.email
                      ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20"
                      : "border-white/15 focus:border-[#C9A24B] focus:ring-[#C9A24B]/30"
                  } text-sm sm:text-base text-[#F5F1E8] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all font-sans`}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-xs text-rose-400 flex items-center gap-1.5 pt-0.5 font-sans font-light"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-phone"
                  className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-300 block"
                >
                  Contact Number <span className="text-[#C9A24B]">*</span>
                </label>
                <input
                  ref={phoneRef}
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98000 00000"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur("phone")}
                  aria-invalid={errors.phone ? "true" : "false"}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className={`w-full h-12 px-4 rounded-xl bg-white/[0.03] border lining-nums ${
                    errors.phone
                      ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20"
                      : "border-white/15 focus:border-[#C9A24B] focus:ring-[#C9A24B]/30"
                  } text-sm sm:text-base text-[#F5F1E8] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all font-sans`}
                />
                {errors.phone && (
                  <p
                    id="phone-error"
                    role="alert"
                    className="text-xs text-rose-400 flex items-center gap-1.5 pt-0.5 font-sans font-light"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Field 4: Advisory Objective Dropdown */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-goal"
                className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-300 block"
              >
                Primary Advisory Objective <span className="text-[#C9A24B]">*</span>
              </label>
              <div className="relative">
                <select
                  ref={goalRef}
                  id="contact-goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  onBlur={() => handleBlur("goal")}
                  aria-invalid={errors.goal ? "true" : "false"}
                  aria-describedby={errors.goal ? "goal-error" : undefined}
                  className={`w-full h-12 px-4 pr-10 rounded-xl bg-[#070B14] border ${
                    errors.goal
                      ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20"
                      : "border-white/15 focus:border-[#C9A24B] focus:ring-[#C9A24B]/30"
                  } text-sm sm:text-base text-[#F5F1E8] focus:outline-none focus:ring-2 transition-all font-sans cursor-pointer appearance-none`}
                >
                  {CONTACT_CONFIG.advisoryObjectives.map((obj) => (
                    <option key={obj} value={obj} className="bg-[#090E1C] text-[#F5F1E8] py-2">
                      {obj}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#C9A24B]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              {errors.goal && (
                <p
                  id="goal-error"
                  role="alert"
                  className="text-xs text-rose-400 flex items-center gap-1.5 pt-0.5 font-sans font-light"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.goal}</span>
                </p>
              )}
            </div>

            {/* Field 5: Optional Message with Counter placed below to avoid collision */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-message"
                className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-300 block"
              >
                Portfolio Context / Specific Requirements (Optional)
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={3}
                maxLength={1000}
                placeholder="Share any background regarding current asset allocation, timeline, or family objectives..."
                value={formData.message}
                onChange={handleChange}
                onBlur={() => handleBlur("message")}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/15 focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/30 text-sm sm:text-base text-[#F5F1E8] placeholder:text-slate-400 focus:outline-none transition-all font-sans resize-none"
              />
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                {errors.message ? (
                  <p role="alert" className="text-xs text-rose-400 flex items-center gap-1.5 font-sans font-light">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.message}</span>
                  </p>
                ) : <div />}
                <span
                  className={`text-[10px] font-mono lining-nums ml-auto ${
                    charsCount > 950 ? "text-amber-400" : "text-slate-400"
                  }`}
                >
                  {charsCount} / 1000
                </span>
              </div>
            </div>

            {/* Field 6: Consent Checkbox & Privacy Link */}
            <div className="pt-1 space-y-2">
              <label htmlFor="contact-consent" className="flex items-start gap-3 cursor-pointer group select-none">
                <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                  <input
                    ref={consentRef}
                    id="contact-consent"
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    onBlur={() => handleBlur("consent")}
                    aria-invalid={errors.consent ? "true" : "false"}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    className="peer sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      formData.consent
                        ? "bg-[#C9A24B] border-[#C9A24B] text-[#070B14]"
                        : "bg-[#090E1C] border-white/30 group-hover:border-[#C9A24B]/70"
                    } peer-focus-visible:ring-2 peer-focus-visible:ring-[#C9A24B] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#090E1C] ${
                      errors.consent ? "border-rose-400" : ""
                    }`}
                  >
                    {formData.consent && <Check className="w-3.5 h-3.5 stroke-[3] text-[#070B14]" />}
                  </div>
                </div>
                <span className="text-xs text-slate-300 font-sans font-light leading-snug group-hover:text-slate-200 transition-colors">
                  {CONTACT_CONFIG.formCopy.consentText} <span className="text-[#C9A24B]">*</span>
                </span>
              </label>

              {errors.consent && (
                <p
                  id="consent-error"
                  role="alert"
                  className="text-xs text-rose-400 flex items-center gap-1.5 font-sans font-light pl-8"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.consent}</span>
                </p>
              )}

              {/* Privacy Notice with Link */}
              <p className="text-[11px] text-slate-400 font-sans pl-8 font-light leading-relaxed">
                {CONTACT_CONFIG.formCopy.privacyLine}{" "}
                <Link
                  to={CONTACT_CONFIG.formCopy.privacyUrl}
                  className="text-[#C9A24B] hover:text-[#d6af57] underline underline-offset-2 transition-colors font-medium"
                >
                  {CONTACT_CONFIG.formCopy.privacyLinkText}
                </Link>
                .
              </p>
            </div>

            {/* Submit Button & Regulatory Note */}
            <div className="pt-2 space-y-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto h-12 min-h-[48px] bg-[#C9A24B] hover:bg-[#d6af57] text-[#070B14] font-sans font-semibold text-xs tracking-wider uppercase px-8 py-3.5 rounded-xl transition-all duration-300 shadow-xl hover:shadow-[#C9A24B]/20 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#070B14]" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Consultation Request</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              {/* Standard Regulatory Note below form */}
              <div className="flex items-start gap-2 pt-2 text-[11px] text-slate-400/90 font-mono leading-relaxed border-t border-white/[0.06]">
                <Lock className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                <span className="lining-nums">
                  SEBI Registered Investment Adviser: {CONTACT_CONFIG.firm.sebiRiaNumber} · Non-custodial direct advisory mandate.
                </span>
              </div>
            </div>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
}
