import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { StockTicker } from "@/components/StockTicker";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Check,
  Download,
  RefreshCw,
  Clock,
  Lock,
  Info,
  Layers,
  FileCheck2,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { submitContactInquiry } from "@/api/email";
import {
  RISK_QUESTIONS,
  DIMENSION_METADATA,
  calculateRiskProfile,
  RiskProfileResult,
  FIDUCIARY_POLICY_CONSTANTS,
} from "@/constants/riskProfileConfig";
import { RiskScoreGauge } from "@/components/risk-profile/RiskScoreGauge";
import { AllocationDonut } from "@/components/risk-profile/AllocationDonut";
import { DimensionBreakdownBars } from "@/components/risk-profile/DimensionBreakdownBars";
import { generateRiskProfilePdf } from "@/components/risk-profile/pdf/generateRiskProfilePdf";

const STORAGE_KEY = "aim_risk_profile_progress_v2";

export default function RiskProfile() {
  const prefersReducedMotion = useReducedMotion();

  // Navigation & Questionnaire Stage State: strictly "intro" | "questionnaire" | "result"
  const [viewMode, setViewMode] = useState<"intro" | "questionnaire" | "result">("intro");
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 to 9
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [direction, setDirection] = useState<1 | -1>(1);

  // PDF Generation State
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Lead Capture State on Result Page
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadCity, setLeadCity] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Accessibility Focus References
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  // 1. Safe Persistence & Migration: validate stored data against current schema
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && parsed.answers && typeof parsed.answers === "object") {
          const validatedAnswers: Record<string, string> = {};
          for (const q of RISK_QUESTIONS) {
            const optId = parsed.answers[q.id];
            if (optId && typeof optId === "string" && q.options.some((o) => o.id === optId)) {
              validatedAnswers[q.id] = optId;
            }
          }

          setAnswers(validatedAnswers);
          const validCount = Object.keys(validatedAnswers).length;

          if (parsed.isCompleted && validCount === RISK_QUESTIONS.length) {
            setViewMode("result");
          } else if (typeof parsed.currentStep === "number") {
            const safeStep = Math.min(Math.max(0, parsed.currentStep), RISK_QUESTIONS.length - 1);
            setCurrentStep(safeStep);
          }
        }
      }
    } catch (err) {
      console.error("Corrupted localStorage detected in RiskProfile; resetting store:", err);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, []);

  // 2. Persist sanitized progress to localStorage
  useEffect(() => {
    try {
      if (Object.keys(answers).length > 0) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            answers,
            currentStep,
            isCompleted: viewMode === "result" && Object.keys(answers).length === RISK_QUESTIONS.length,
          })
        );
      }
    } catch (err) {
      console.error("Failed to persist risk profile progress:", err);
    }
  }, [answers, currentStep, viewMode]);

  // 3. Scroll & Focus management on stage transition
  useEffect(() => {
    if (viewMode === "questionnaire") {
      questionHeadingRef.current?.focus();
    } else if (viewMode === "result") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const timer = setTimeout(() => {
        resultHeadingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        resultHeadingRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [currentStep, viewMode]);

  // 4. Robust score calculation with comprehensive error isolation
  const { result, calculationError } = useMemo(() => {
    try {
      const answeredKeys = Object.keys(answers);
      if (answeredKeys.length === 0) {
        return { result: null, calculationError: null };
      }

      // Check for missing questions
      const missingQuestions = RISK_QUESTIONS.filter(
        (q) => !answers[q.id] || !q.options.some((o) => o.id === answers[q.id])
      );

      if (missingQuestions.length > 0) {
        // Only consider it an error if we are on the result view
        if (viewMode === "result") {
          return {
            result: null,
            calculationError: `Incomplete questionnaire: Questions ${missingQuestions
              .map((q) => q.number)
              .join(", ")} are unanswered or invalid.`,
          };
        }
        return { result: null, calculationError: null };
      }

      const computed = calculateRiskProfile(answers);

      if (
        !computed ||
        typeof computed.normalizedScore !== "number" ||
        isNaN(computed.normalizedScore) ||
        !computed.archetype
      ) {
        throw new Error("Mathematical scoring error: Computed risk profile is NaN or incomplete.");
      }

      // Dev-only debug log
      if (import.meta.env.DEV) {
        console.debug("[RiskProfile] Computed assessment:", {
          answers,
          rawScore: computed.rawScore,
          normalizedScore: computed.normalizedScore,
          archetype: computed.archetype.name,
          isHorizonCapped: computed.isHorizonCapped,
        });
      }

      return { result: computed, calculationError: null };
    } catch (err: any) {
      console.error("Calculation failure in RiskProfile:", err);
      return {
        result: null,
        calculationError:
          err?.message || "An unexpected error occurred while calculating your risk score.",
      };
    }
  }, [answers, viewMode]);

  const activeQuestion = RISK_QUESTIONS[currentStep];
  const selectedOptionId = activeQuestion ? answers[activeQuestion.id] : undefined;
  const isCurrentAnswered = !!selectedOptionId;

  // Handlers
  const handleSelectOption = useCallback(
    (questionId: string, optionId: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    },
    []
  );

  const handleNext = useCallback(() => {
    if (!isCurrentAnswered) return;

    if (currentStep < RISK_QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      // Completed all 10 questions -> switch to result stage
      setViewMode("result");
    }
  }, [currentStep, isCurrentAnswered]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleReset = useCallback(() => {
    setAnswers({});
    setCurrentStep(0);
    setViewMode("intro");
    setLeadSubmitted(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("Assessment progress reset.");
  }, []);

  const handleStartOrResume = useCallback(() => {
    setViewMode("questionnaire");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Keyboard navigation for radio options
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (!activeQuestion) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const nextIndex = (index + 1) % activeQuestion.options.length;
        const nextOpt = activeQuestion.options[nextIndex];
        handleSelectOption(activeQuestion.id, nextOpt.id);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prevIndex =
          (index - 1 + activeQuestion.options.length) % activeQuestion.options.length;
        const prevOpt = activeQuestion.options[prevIndex];
        handleSelectOption(activeQuestion.id, prevOpt.id);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const currentOpt = activeQuestion.options[index];
        if (selectedOptionId === currentOpt.id) {
          handleNext();
        } else {
          handleSelectOption(activeQuestion.id, currentOpt.id);
        }
      } else if (e.key === " ") {
        e.preventDefault();
        const currentOpt = activeQuestion.options[index];
        handleSelectOption(activeQuestion.id, currentOpt.id);
      }
    },
    [activeQuestion, handleNext, handleSelectOption, selectedOptionId]
  );

  // PDF Download Trigger
  const handleDownloadPdf = async () => {
    if (!result) return;
    setIsDownloadingPdf(true);
    try {
      const consultationUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/contact`
          : "https://alphaaim.in/contact";

      const { blob, filename } = await generateRiskProfilePdf(result, consultationUrl);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Institutional Risk Profile Report downloaded successfully");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF report. Please try again.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Written IPS Lead Submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail || !leadPhone || !result) return;

    setIsSubmittingLead(true);
    try {
      await submitContactInquiry({
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        goal: `Risk Assessment Profile: ${result.archetype.name} (Score: ${result.normalizedScore}/100)`,
        message: `Client completed 10-question institutional risk profile.\nArchetype: ${result.archetype.name}\nScore: ${result.normalizedScore}/100 (Raw: ${result.rawScore}/${result.maxRawScore})\nIndicative Allocation: Equity ${result.archetype.allocation.equity}%, Debt ${result.archetype.allocation.debt}%, Gold ${result.archetype.allocation.gold}%, Cash ${result.archetype.allocation.cash}%\nTime Horizon Capped: ${result.isHorizonCapped ? "YES (Under 1 Year)" : "NO"}\nLocation: ${leadCity || "Pune"}`,
        consent: true,
      });
      setLeadSubmitted(true);
      toast.success("Your Investment Policy Statement request has been received.");
    } catch (err) {
      console.error("Lead submission error:", err);
      setLeadSubmitted(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Motion variants for slide/fade transitions
  const slideVariants = {
    enter: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? 28 : -28,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0.01 : 0.28, ease: "easeOut" as const },
    },
    exit: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? -28 : 28,
      opacity: 0,
      transition: { duration: prefersReducedMotion ? 0.01 : 0.2, ease: "easeIn" as const },
    }),
  };

  const answeredCount = Object.keys(answers).length;
  const hasSavedProgress = answeredCount > 0 && answeredCount < RISK_QUESTIONS.length;

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F1E8] flex flex-col selection:bg-[#C9A96E]/30 selection:text-[#F5F1E8] overflow-x-hidden relative">
      {/* Background Radial Glow */}
      <div
        className="absolute top-32 left-1/2 -translate-x-1/2 w-[720px] h-[520px] bg-[#C9A96E]/[0.035] rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <Navbar />
      <StockTicker />

      <main className="flex-1">
        {/* =========================================================
            STAGE 1: INTRO SCREEN
           ========================================================= */}
        {viewMode === "intro" && (
          <section className="pt-16 pb-28 sm:pt-24 sm:pb-36">
            <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-4xl text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.6 }}
                className="space-y-4 max-w-3xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[10px] font-mono uppercase tracking-[0.25em] text-[#C9A96E]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SEBI RIA Suitability Mandate · INA000017348</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F5F1E8] leading-[1.12]">
                  Institutional Risk Profiling <br />
                  <span className="italic text-[#C9A96E]">&amp; Suitability Diagnostic.</span>
                </h1>

                <p className="text-[#CBD5E1] text-sm sm:text-base font-sans font-normal max-w-2xl mx-auto leading-relaxed pt-2">
                  Under SEBI (Investment Advisers) Regulations, 2013, fiduciary advisory mandates
                  establishing your true risk capacity, time horizon, and drawdown resilience before
                  deploying capital. Discover your scientific investor archetype and baseline asset
                  allocation.
                </p>
              </motion.div>

              {/* Three Pillars Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2 max-w-3xl mx-auto">
                <div className="p-5 sm:p-6 rounded-2xl bg-[#090E1C] border border-white/[0.08] space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-base text-[#F5F1E8] lining-figures">
                    <span className="lining-figures font-serif">5</span> Dimensions
                  </h3>
                  <p className="text-[14px] text-[#CBD5E1] font-sans font-normal leading-[1.6]">
                    {FIDUCIARY_POLICY_CONSTANTS.dimensionsCardDescription}
                  </p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-[#090E1C] border border-white/[0.08] space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E]">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-base text-[#F5F1E8]">
                    {FIDUCIARY_POLICY_CONSTANTS.fiduciaryGuardTitle}
                  </h3>
                  <p className="text-[14px] text-[#CBD5E1] font-sans font-normal leading-[1.6]">
                    {FIDUCIARY_POLICY_CONSTANTS.shortTermCapitalPolicy}
                  </p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-[#090E1C] border border-white/[0.08] space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E]">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-base text-[#F5F1E8]">
                    {FIDUCIARY_POLICY_CONSTANTS.pdfReportTitle}
                  </h3>
                  <p className="text-[14px] text-[#CBD5E1] font-sans font-normal leading-[1.6]">
                    {FIDUCIARY_POLICY_CONSTANTS.pdfReportDescription}
                  </p>
                </div>
              </div>

              {/* Privacy Reassurance Line */}
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#CBD5E1] pt-1">
                <Clock className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span>Takes about 2 minutes</span>
                <span className="text-white/20">·</span>
                <Lock className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span>{FIDUCIARY_POLICY_CONSTANTS.reassuranceText}</span>
              </div>

              {/* Action Buttons: tightened vertical rhythm */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1 pb-4">
                <Button
                  onClick={handleStartOrResume}
                  className="w-full sm:w-auto bg-[#C9A96E] hover:bg-[#d8b97e] text-[#070B14] font-semibold text-xs uppercase tracking-wider px-10 py-6 rounded-xl shadow-xl shadow-[#C9A96E]/20 flex items-center justify-center gap-2"
                >
                  <span>
                    {hasSavedProgress
                      ? `Resume Assessment (${answeredCount}/10 answered)`
                      : "Begin Risk Assessment"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                {hasSavedProgress && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full sm:w-auto border-white/10 text-xs px-6 py-6 rounded-xl text-[#CBD5E1] hover:text-[#F5F1E8]"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-2" />
                    <span>Start Fresh</span>
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            STAGE 2: QUESTIONNAIRE FLOW (10 QUESTIONS)
           ========================================================= */}
        {viewMode === "questionnaire" && activeQuestion && (
          <section className="py-12 sm:py-16 min-h-[600px]">
            <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-6xl">
              {/* Top Meta Bar */}
              <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Privacy Badge */}
                <div className="flex items-center gap-2 text-xs font-mono text-[#CBD5E1]">
                  <Lock className="w-3.5 h-3.5 text-[#C9A96E]" />
                  <span>{FIDUCIARY_POLICY_CONSTANTS.reassuranceText}</span>
                </div>

                {/* Restart Action */}
                <button
                  onClick={handleReset}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#A8B0BD] hover:text-[#C9A96E] transition-colors self-start sm:self-auto"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restart Assessment</span>
                </button>
              </div>

              {/* Segmented 10-Step Progress Bar */}
              <div className="max-w-4xl mx-auto mb-8 space-y-2">
                <div
                  role="progressbar"
                  aria-valuenow={currentStep + 1}
                  aria-valuemin={1}
                  aria-valuemax={10}
                  aria-valuetext={`Question ${currentStep + 1} of 10: ${activeQuestion.category}`}
                  className="grid grid-cols-10 gap-1.5 sm:gap-2 h-2"
                >
                  {RISK_QUESTIONS.map((q, idx) => {
                    const isCompleted = answers[q.id] !== undefined;
                    const isCurrent = idx === currentStep;

                    return (
                      <div
                        key={q.id}
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCurrent
                            ? "bg-[#C9A96E] ring-2 ring-[#C9A96E]/40 animate-pulse"
                            : isCompleted
                            ? "bg-[#C9A96E]"
                            : "bg-white/[0.08]"
                        }`}
                        title={`Question ${idx + 1}: ${q.category}`}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="text-[#C9A96E] uppercase tracking-wider font-medium">
                    Question {currentStep + 1} of {RISK_QUESTIONS.length}
                  </span>
                  <span className="text-[#A8B0BD]">
                    {activeQuestion.category} · {Math.round(((currentStep + 1) / 10) * 100)}% Complete
                  </span>
                </div>
              </div>

              {/* Main Content Layout: Question Card (Left) + Side Panel (Right) */}
              <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Screen-reader Live Region */}
                <div aria-live="polite" className="sr-only">
                  Question {currentStep + 1} of {RISK_QUESTIONS.length}: {activeQuestion.title}
                </div>

                {/* Left/Main Column: Question Card */}
                <div className="lg:col-span-8 p-6 sm:p-10 rounded-3xl bg-[#090E1C] border border-white/[0.08] shadow-2xl flex flex-col justify-between min-h-[520px] relative">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={activeQuestion.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6 flex-1 flex flex-col justify-between"
                    >
                      {/* Heading and Context */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                          {activeQuestion.category} · Question {currentStep + 1}
                        </span>
                        <h2
                          id="question-heading"
                          ref={questionHeadingRef}
                          tabIndex={-1}
                          className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-normal leading-snug outline-none"
                        >
                          {activeQuestion.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#A8B0BD] font-sans font-light leading-relaxed">
                          {activeQuestion.explanation}
                        </p>
                      </div>

                      {/* Accessible Radiogroup */}
                      <div
                        role="radiogroup"
                        aria-labelledby="question-heading"
                        className="space-y-3 pt-2"
                      >
                        {activeQuestion.options.map((option, idx) => {
                          const isSelected = selectedOptionId === option.id;

                          return (
                            <label
                              key={option.id}
                              onKeyDown={(e) => handleKeyDown(e, idx)}
                              tabIndex={0}
                              className={`relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none group min-h-[56px] ${
                                isSelected
                                  ? "bg-[#C9A96E]/10 border-[#C9A96E] shadow-[0_0_24px_rgba(201,169,110,0.15)] ring-1 ring-[#C9A96E]/60"
                                  : "bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
                              }`}
                            >
                              <input
                                type="radio"
                                name={activeQuestion.id}
                                value={option.id}
                                checked={isSelected}
                                onChange={() => handleSelectOption(activeQuestion.id, option.id)}
                                className="sr-only"
                                tabIndex={-1}
                              />

                              {/* Custom Radio Circle Indicator */}
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                  isSelected
                                    ? "border-[#C9A96E] bg-[#C9A96E] text-[#070B14] shadow-[0_0_10px_rgba(201,169,110,0.4)]"
                                    : "border-white/25 group-hover:border-white/40"
                                }`}
                                aria-hidden="true"
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>

                              {/* Text & Subtext */}
                              <div className="space-y-0.5 flex-1">
                                <p
                                  className={`text-sm sm:text-base font-sans font-medium transition-colors ${
                                    isSelected ? "text-[#F5F1E8]" : "text-[#F5F1E8]/90"
                                  }`}
                                >
                                  {option.text}
                                </p>
                                {option.subtext && (
                                  <p className="text-xs text-[#A8B0BD] font-sans font-light">
                                    {option.subtext}
                                  </p>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>

                      {/* Footer Navigation Buttons */}
                      <div className="flex items-center justify-between pt-6 border-t border-white/[0.08] mt-4">
                        <Button
                          onClick={handlePrev}
                          disabled={currentStep === 0}
                          variant="outline"
                          className="border-white/10 text-xs px-5 py-5 rounded-xl text-[#A8B0BD] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#F5F1E8]"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          <span>Previous</span>
                        </Button>

                        <Button
                          onClick={handleNext}
                          disabled={!isCurrentAnswered}
                          className={`font-semibold text-xs uppercase tracking-wider px-8 py-5 rounded-xl transition-all flex items-center gap-2 ${
                            isCurrentAnswered
                              ? "bg-[#C9A96E] hover:bg-[#d8b97e] text-[#070B14] shadow-lg shadow-[#C9A96E]/20 cursor-pointer"
                              : "bg-white/[0.04] text-[#A8B0BD]/40 border border-white/[0.08] cursor-not-allowed opacity-50 shadow-none"
                          }`}
                        >
                          <span>
                            {currentStep === RISK_QUESTIONS.length - 1
                              ? "See My Risk Profile"
                              : "Next Question"}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right Column: Desktop Context Side Panel */}
                <div className="lg:col-span-4 space-y-6">
                  {/* "Why This Question Matters" Card */}
                  <div className="p-6 rounded-3xl bg-[#090E1C] border border-[#C9A96E]/20 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#C9A96E] uppercase tracking-wider">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>Why This Matters</span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#F5F1E8]/90 font-sans font-light leading-relaxed">
                      {activeQuestion.whyItMatters}
                    </p>

                    <div className="pt-2 border-t border-white/[0.08] space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#A8B0BD]">
                        <span>Suitability Dimension:</span>
                        <span className="text-[#C9A96E]">
                          {DIMENSION_METADATA[activeQuestion.dimension]?.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#A8B0BD]">
                        <span>Regulatory Base:</span>
                        <span className="text-[#F5F1E8]">SEBI RIA Reg 16(1)</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary of Answered Questions */}
                  <div className="p-6 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#A8B0BD] uppercase tracking-wider">
                        Question Audit Status
                      </span>
                      <span className="text-[#C9A96E]">{answeredCount} of 10</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {RISK_QUESTIONS.map((q, idx) => {
                        const isDone = answers[q.id] !== undefined;
                        const isCurrent = idx === currentStep;

                        return (
                          <div
                            key={q.id}
                            className={`flex items-center justify-between text-[11px] font-mono px-2.5 py-1.5 rounded-lg transition-colors ${
                              isCurrent
                                ? "bg-[#C9A96E]/10 text-[#C9A96E] font-medium"
                                : isDone
                                ? "text-[#F5F1E8]/80 hover:bg-white/[0.02]"
                                : "text-white/20"
                            }`}
                          >
                            <span className="truncate pr-2">
                              {idx + 1}. {q.category}
                            </span>
                            {isDone ? (
                              <Check className="w-3 h-3 text-[#C9A96E] shrink-0" />
                            ) : (
                              <span className="text-[10px] text-white/30 shrink-0">pending</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            STAGE 3: RESULTS SCREEN (NEVER LEAVES BLANK SCREEN)
           ========================================================= */}
        {viewMode === "result" && (
          <section className="py-12 sm:py-20 min-h-[700px] flex flex-col justify-start">
            <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-5xl space-y-10">
              {/* FALLBACK PANEL: Shown if calculation threw an error or answers are corrupted */}
              {!result || calculationError ? (
                <div className="p-8 sm:p-12 rounded-3xl bg-[#090E1C] border border-amber-500/30 shadow-2xl text-center space-y-6">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-normal">
                      Assessment Diagnostic Incomplete
                    </h2>
                    <p className="text-sm text-[#A8B0BD] max-w-lg mx-auto leading-relaxed">
                      {calculationError ||
                        "We could not compute your risk profile because one or more questions were incomplete or contained invalid data."}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Button
                      onClick={handleReset}
                      className="bg-[#C9A96E] hover:bg-[#d8b97e] text-[#070B14] font-semibold text-xs uppercase tracking-wider px-8 py-5 rounded-xl shadow-lg shadow-[#C9A96E]/20"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      <span>Retake Assessment</span>
                    </Button>
                    <Button
                      onClick={() => setViewMode("questionnaire")}
                      variant="outline"
                      className="border-white/10 text-xs px-6 py-5 rounded-xl text-[#CBD5E1] hover:text-[#F5F1E8]"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      <span>Return to Questions</span>
                    </Button>
                  </div>
                </div>
              ) : (
                /* SUCCESSFUL RESULT DISPLAY: Visible by default, enhanced by smooth CSS transition */
                <div className="space-y-10 opacity-100 transition-opacity duration-300">
                  {/* Result Hero Card */}
                  <div className="p-8 sm:p-12 rounded-3xl bg-[#090E1C] border border-[#C9A96E]/30 shadow-2xl space-y-8 relative overflow-hidden">
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>SEBI RIA Suitability Mandate · Diagnostic Complete</span>
                        </div>

                        <h2
                          id="result-heading"
                          ref={resultHeadingRef}
                          tabIndex={-1}
                          className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5F1E8] font-normal leading-tight outline-none"
                        >
                          {result.archetype.name}
                        </h2>

                        <p className="text-sm sm:text-base font-serif italic text-[#C9A96E]">
                          "{result.archetype.tagline}"
                        </p>
                      </div>

                      {/* Top Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          onClick={handleDownloadPdf}
                          disabled={isDownloadingPdf}
                          className="bg-[#C9A96E] hover:bg-[#d8b97e] text-[#070B14] font-semibold text-xs uppercase tracking-wider px-5 py-5 rounded-xl shadow-lg shadow-[#C9A96E]/20 flex items-center gap-2"
                        >
                          {isDownloadingPdf ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Generating PDF...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>Download Risk Profile Report</span>
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={handleReset}
                          variant="outline"
                          className="border-white/10 text-xs px-4 py-5 rounded-xl text-[#A8B0BD] hover:text-[#F5F1E8]"
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-2" />
                          <span>Retake</span>
                        </Button>
                      </div>
                    </div>

                    {/* SEBI Horizon Override Guard Banner (if triggered) */}
                    {result.isHorizonCapped && (
                      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 text-amber-200">
                        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-xs font-sans leading-relaxed">
                          <p className="font-semibold text-sm text-amber-300">
                            SEBI Fiduciary Guard Enforced: Capital Preservation Priority
                          </p>
                          <p className="text-amber-200/90 font-light">
                            {result.horizonCapReason ||
                              "You selected an investment time horizon of less than 1 year (Question 1). Under SEBI (Investment Advisers) Regulations, 2013, capital needed within 12 months cannot be exposed to aggressive or high-volatility equity strategies, regardless of risk tolerance. Your asset allocation is strictly capped at Conservative Fiduciary."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Archetype Executive Description */}
                    <p className="text-[#A8B0BD] text-sm sm:text-base font-sans font-light leading-relaxed">
                      {result.archetype.description}
                    </p>

                    {/* Visual Analytics Section: Section title + Vertically centered Gauge and Donut Cards */}
                    <div className="pt-2 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                          Scientific Portfolio Diagnostics & Target Asset Mix
                        </span>
                        <span className="text-[10px] font-mono text-[#A8B0BD] hidden sm:inline">
                          Fiduciary Allocation Framework
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2">
                        <div className="flex items-center justify-center w-full">
                          <RiskScoreGauge
                            score={result.normalizedScore}
                            archetypeName={result.archetype.name}
                            categoryName={result.archetype.name}
                          />
                        </div>

                        <div className="flex items-center justify-center w-full">
                          <AllocationDonut
                            allocation={result.archetype.allocation}
                            archetypeName={result.archetype.name}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 5-Dimension Suitability Breakdown Bars */}
                    <DimensionBreakdownBars
                      dimensions={result.dimensionScores}
                      dimensionScores={result.dimensionScores}
                    />

                    {/* Benchmark, Horizon & Volatility Metric Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#070B14] border border-white/[0.08] text-xs font-mono">
                      <div className="space-y-1">
                        <span className="text-[#A8B0BD] uppercase tracking-wider text-[10px]">
                          Expected Volatility Band
                        </span>
                        <p className="text-[#C9A96E] font-semibold text-sm">
                          {result.archetype.volatilityBand}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[#A8B0BD] uppercase tracking-wider text-[10px]">
                          Regulatory Benchmark
                        </span>
                        <p className="text-[#F5F1E8] font-medium text-xs leading-snug">
                          {result.archetype.benchmark}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[#A8B0BD] uppercase tracking-wider text-[10px]">
                          Recommended Horizon
                        </span>
                        <p className="text-[#F5F1E8] font-medium text-xs">
                          {result.archetype.recommendedHorizon}
                        </p>
                      </div>
                    </div>

                    {/* Required Statutory Caveat */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-[#A8B0BD] font-sans font-light leading-relaxed">
                      <span className="font-semibold text-[#F5F1E8]">Indicative Asset Allocation Notice: </span>
                      Indicative profile based on your answers. Not an investment recommendation.
                      Suitability is assessed only through a formal advisory engagement.
                    </div>

                    {/* Consultation Navigation CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
                      <p className="text-xs text-[#A8B0BD] font-sans">
                        Ready to translate this diagnostic into a customized execution plan?
                      </p>
                      <Link
                        to={`/contact?note=${encodeURIComponent(
                          `Risk Profile Diagnostic: ${result.archetype.name} (Score: ${result.normalizedScore}/100)`
                        )}`}
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C9A96E] hover:text-[#d8b97e] font-semibold transition-colors"
                      >
                        <span>Discuss with an advisor</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* LEAD CAPTURE: FORMAL INVESTMENT POLICY STATEMENT (IPS) */}
                  <div className="p-8 sm:p-12 rounded-3xl bg-[#090E1C] border border-white/[0.08] shadow-2xl space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                        SEBI RIA Mandate · Written Documentation
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-normal">
                        Receive Your Written Investment Policy Statement (IPS)
                      </h3>
                      <p className="text-[#A8B0BD] text-xs sm:text-sm font-sans font-light leading-relaxed">
                        Under SEBI (Investment Advisers) Regulations, 2013, all advisory execution requires
                        a signed Investment Policy Statement. Enter your details below to receive a formal
                        draft calibrated to your{" "}
                        <strong className="text-[#F5F1E8] font-medium">{result.archetype.name}</strong>{" "}
                        profile.
                      </p>
                    </div>

                    {leadSubmitted ? (
                      <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                        <h4 className="font-serif text-2xl text-[#F5F1E8]">IPS Roadmap Dispatched</h4>
                        <p className="text-xs text-[#A8B0BD] font-sans max-w-md mx-auto leading-relaxed">
                          Thank you, <strong className="text-white">{leadName}</strong>. Your customized
                          Investment Policy Statement has been compiled. Our Pune advisory desk will reach
                          out via WhatsApp/email at <strong className="text-white">{leadPhone}</strong>.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleLeadSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-1">
                            <label className="text-[11px] font-mono uppercase tracking-wider text-[#A8B0BD]">
                              Full Name <span className="text-[#C9A96E]">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Rahul Deshmukh"
                              value={leadName}
                              onChange={(e) => setLeadName(e.target.value)}
                              className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F1E8] focus:border-[#C9A96E] focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-mono uppercase tracking-wider text-[#A8B0BD]">
                              Email Address <span className="text-[#C9A96E]">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="name@domain.com"
                              value={leadEmail}
                              onChange={(e) => setLeadEmail(e.target.value)}
                              className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F1E8] focus:border-[#C9A96E] focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-mono uppercase tracking-wider text-[#A8B0BD]">
                              WhatsApp / Phone <span className="text-[#C9A96E]">*</span>
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="+91 98000 00000"
                              value={leadPhone}
                              onChange={(e) => setLeadPhone(e.target.value)}
                              className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F1E8] focus:border-[#C9A96E] focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-mono uppercase tracking-wider text-[#A8B0BD]">
                              City / Location
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Pune, Mumbai, NRI (Dubai)"
                              value={leadCity}
                              onChange={(e) => setLeadCity(e.target.value)}
                              className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F1E8] focus:border-[#C9A96E] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button
                            type="submit"
                            disabled={isSubmittingLead}
                            className="w-full sm:w-auto bg-[#C9A96E] hover:bg-[#d8b97e] text-[#070B14] font-semibold text-xs uppercase tracking-wider px-10 py-6 rounded-xl transition-all shadow-xl hover:shadow-[#C9A96E]/20 flex items-center justify-center gap-2"
                          >
                            {isSubmittingLead ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Generating Your IPS...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                <span>Get My Written IPS &amp; Consultation</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <CTA
          pill="FIDUCIARY ALLOCATION"
          headlineLead="Calculators simulate possibilities."
          headlineEmphasis="A fiduciary adviser builds your reality."
          subtitle="Use our risk profiling engine to benchmark your comfort zone, then schedule a confidential portfolio architecture session."
          buttonLabel="Discuss Your Allocation"
        />
      </main>

      <Footer />
    </div>
  );
}
