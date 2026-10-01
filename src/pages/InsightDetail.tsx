import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { StockTicker } from "@/components/StockTicker";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import {
  Clock,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Download,
  Share2,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  Linkedin,
  Mail,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  Shield,
  HelpCircle,
  BookOpen,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import {
  INSIGHTS_POSTS,
  computeReadTime,
  INSIGHTS_COMPLIANCE_DISCLOSURE,
  INSIGHT_ARTICLES,
  FullInsightArticle,
} from "@/data/insightsData";
import { InsightCover } from "@/components/insights/InsightCover";
import { InsightChartRenderer } from "@/components/insights/InsightCharts";

export default function InsightDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = INSIGHTS_POSTS.find((p) => p.slug === slug);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Reading progress tracking
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for Table of Contents active link
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target?.id) {
          setActiveSectionId(visible.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    const sectionElements = document.querySelectorAll("[data-toc-target]");
    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [slug]);

  if (!post) {
    return <Navigate to="/insights" replace />;
  }

  const article: FullInsightArticle =
    INSIGHT_ARTICLES[post.slug] || {
      slug: post.slug,
      title: post.title,
      standfirst: post.excerpt,
      category: post.category,
      publishedDate: post.publishedDate,
      publishedIsoDate: post.publishedIsoDate || "2026-09-01",
      lastUpdatedDate: post.lastUpdatedDate || post.publishedDate,
      lastUpdatedIsoDate: post.lastUpdatedIsoDate || post.publishedIsoDate || "2026-09-28",
      reviewStatus: post.reviewStatus || "approved by compliance",
      complianceApprovalDate: post.complianceApprovalDate || "September 2026",
      author: {
        name: post.author.name,
        role: post.author.role || "Fiduciary Advisory",
        credentials: post.author.credentials || "SEBI Registered Investment Adviser",
        bio: post.author.bio || "Fiduciary investment adviser at Alpha Investment Management.",
      },
      keyTakeaways: post.keyTakeaways,
      sections: [],
      workedExample: {
        title: "Mathematical Demonstration",
        scenario: "",
        assumptions: [],
        table: { headers: [], rows: [] },
        takeaway: "",
      },
      commonMistakes: [],
      adviserChecklist: [],
      sources: [],
    };

  // Prev / Next Post
  const currentIndex = INSIGHTS_POSTS.findIndex((p) => p.slug === post.slug);
  const prevPost =
    currentIndex > 0 ? INSIGHTS_POSTS[currentIndex - 1] : INSIGHTS_POSTS[INSIGHTS_POSTS.length - 1];
  const nextPost =
    currentIndex < INSIGHTS_POSTS.length - 1 ? INSIGHTS_POSTS[currentIndex + 1] : INSIGHTS_POSTS[0];

  // 3 Related Posts (excluding current)
  const relatedPosts = INSIGHTS_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  const dynamicReadTime = computeReadTime(post);

  // Social sharing handlers
  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://alphaaim.in/insights/${post.slug}`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  const handleNativeShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  // Table of Contents List
  const tocItems = [
    { id: "executive-summary", label: "Executive Summary" },
    ...article.sections.map((s) => ({ id: s.id, label: s.title })),
    ...(article.workedExample?.scenario ? [{ id: "worked-example", label: "Worked Example & Data" }] : []),
    ...(article.commonMistakes?.length ? [{ id: "common-pitfalls", label: "Common Pitfalls" }] : []),
    ...(article.adviserChecklist?.length ? [{ id: "adviser-questions", label: "Questions for Adviser" }] : []),
    ...(article.sources?.length ? [{ id: "sources-references", label: "Sources & Citations" }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F1E8] flex flex-col selection:bg-[#C9A96E]/30 selection:text-[#F5F1E8] overflow-x-hidden">
      <SEO
        title={`${post.title} | Alpha Investment Management`}
        description={post.excerpt}
        ogType="article"
        ogImage={post.coverImage}
      />

      {/* Structured Article Schema (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            datePublished: post.publishedIsoDate || "2026-09-01",
            dateModified: post.lastUpdatedIsoDate || post.publishedIsoDate || "2026-09-28",
            author: {
              "@type": "Person",
              name: post.author.name,
              jobTitle: post.author.role,
            },
            publisher: {
              "@type": "Organization",
              name: "Alpha Investment Management",
              logo: {
                "@type": "ImageObject",
                url: "https://alphaaim.in/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": shareUrl,
            },
          }),
        }}
      />

      <Navbar />
      <StockTicker />

      {/* Slim Gold Reading Progress Bar */}
      <div className="reading-progress-bar fixed top-[64px] sm:top-[72px] left-0 right-0 h-[3px] z-40 bg-white/[0.04]">
        <div
          className="h-full bg-gradient-to-r from-[#C9A96E] via-[#EADFC7] to-[#C9A96E] transition-all duration-75 ease-out shadow-[0_0_8px_rgba(201,169,110,0.5)]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="flex-1 pb-24">
        {/* Article Header & Meta Section */}
        <header className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 border-b border-white/[0.08] bg-gradient-to-b from-[#090E1C] to-[#070B14]">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-5xl relative z-10 space-y-6">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Link to="/" className="hover:text-[#C9A96E] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/insights" className="hover:text-[#C9A96E] transition-colors">
                Insights
              </Link>
              <span>/</span>
              <span className="text-[#C9A96E]">{post.category}</span>
            </nav>

            <div className="space-y-4">
              {/* Category, Read Time, Published & Review Status */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] font-medium">
                  {post.category}
                </span>
                <span className="text-[#C9A96E]/40">·</span>
                <span className="text-[#CBD5E1] flex items-center gap-1.5 tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-[#C9A96E]" /> {dynamicReadTime}
                </span>
                <span className="text-[#C9A96E]/40">·</span>
                <span className="text-[#CBD5E1] flex items-center gap-1.5 tabular-nums">
                  <Calendar className="w-3.5 h-3.5 text-[#C9A96E]" /> {post.publishedDate}
                </span>
                {post.lastUpdatedDate && (
                  <>
                    <span className="text-[#C9A96E]/40 hidden sm:inline">·</span>
                    <span className="text-slate-400 hidden sm:inline tabular-nums">
                      Updated {post.lastUpdatedDate}
                    </span>
                  </>
                )}
                {post.reviewStatus && (
                  <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Shield className="w-3 h-3" />
                    <span>Compliance Approved</span>
                  </span>
                )}
              </div>

              {/* Serif H1 Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F5F1E8] leading-[1.12]">
                {post.title}
              </h1>

              {/* Standfirst Excerpt */}
              <p className="text-base sm:text-xl text-[#CBD5E1] font-sans font-normal leading-relaxed pt-1">
                {article.standfirst || post.excerpt}
              </p>

              {/* Byline Row (Strictly Text-Only, NO Avatars) */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
                <div className="space-y-0.5">
                  <p className="text-sm font-sans font-medium text-[#F5F1E8]">
                    By {post.author.name}
                  </p>
                  {post.author.role && (
                    <p className="text-xs text-[#B0BAC9] font-sans">
                      {post.author.role} {post.author.credentials ? `· ${post.author.credentials}` : ""}
                    </p>
                  )}
                </div>

                {/* Header Action Tools */}
                <div className="flex items-center gap-2.5">
                  {post.downloadablePdf && (
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/10 hover:border-[#C9A96E] text-xs h-9 px-3.5 flex items-center gap-2 bg-transparent text-[#F5F1E8]"
                    >
                      <a
                        href="/downloads/AIM-Three-Bucket-Retirement-Plan.pdf"
                        download="AIM-Three-Bucket-Retirement-Plan.pdf"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5 text-[#C9A96E]" />
                        <span>Download Whitepaper (PDF)</span>
                      </a>
                    </Button>
                  )}

                  <button
                    onClick={() => window.print()}
                    title="Print analysis"
                    className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-[#C9A96E] hover:border-[#C9A96E]/50 transition-colors"
                    aria-label="Print article"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Cover Banner */}
        <section className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-5xl pt-10 pb-6">
          <InsightCover
            category={post.category}
            title={post.title}
            coverImage={post.coverImage}
            coverImageSrcSet={post.coverImageSrcSet}
            altText={post.imageMetadata?.altText}
            variant="hero"
            priority={true}
            className="rounded-3xl h-[280px] sm:h-[420px] shadow-2xl"
          />
          {post.imageMetadata?.photographer && (
            <p className="text-[11px] font-mono text-slate-400 text-right pt-2">
              Photo: {post.imageMetadata.photographer} · Unsplash Institutional License
            </p>
          )}
        </section>

        {/* Mobile Sticky TOC Accordion */}
        <div className="lg:hidden container mx-auto px-6 sm:px-10 max-w-5xl py-3">
          <div className="rounded-2xl bg-[#090E1C] border border-white/[0.08] overflow-hidden">
            <button
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-mono text-[#C9A96E] hover:text-[#DFCA9F]"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Table of Contents
              </span>
              {mobileTocOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {mobileTocOpen && (
              <nav className="p-4 pt-1 border-t border-white/[0.06] space-y-2">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileTocOpen(false)}
                    className={`block text-xs font-sans py-1.5 transition-colors ${
                      activeSectionId === item.id
                        ? "text-[#C9A96E] font-medium"
                        : "text-slate-400 hover:text-[#F5F1E8]"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* Main Content Layout: 12-Column Grid with Reading Column (~680px) and Sticky TOC Rail */}
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-6xl pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Reading Column (Col-span-8: ~680px max-width) */}
            <article className="lg:col-span-8 max-w-[680px] space-y-12">
              {/* Executive Summary Box */}
              <div
                id="executive-summary"
                data-toc-target="true"
                className="p-7 sm:p-8 rounded-3xl bg-[#090E1C] border border-[#C9A96E]/30 space-y-4 shadow-xl"
              >
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                  <span>Executive Summary &amp; Fiduciary Takeaways</span>
                </div>
                <ul className="space-y-3">
                  {article.keyTakeaways.map((takeaway, i) => (
                    <li
                      key={i}
                      className="text-xs sm:text-sm text-[#CBD5E1] font-sans font-normal flex items-start gap-3 leading-relaxed"
                    >
                      <span className="text-[#C9A96E] font-bold mt-0.5">•</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pull Quote (if provided) */}
              {article.pullQuote && (
                <figure className="border-l-2 border-[#C9A96E] pl-6 sm:pl-8 py-2 space-y-2">
                  <blockquote className="font-serif italic text-xl sm:text-2xl text-[#F5F1E8] leading-snug">
                    "{article.pullQuote.quote}"
                  </blockquote>
                  <figcaption className="text-xs font-mono text-[#C9A96E]">
                    — {article.pullQuote.author}, {article.pullQuote.title}
                  </figcaption>
                </figure>
              )}

              {/* Structured Sections */}
              {article.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  data-toc-target="true"
                  className="space-y-6 pt-4 scroll-mt-28"
                >
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-normal border-b border-white/[0.08] pb-3">
                    {section.title}
                  </h2>

                  {/* Paragraphs */}
                  <div className="space-y-5 text-[17px] sm:text-[18px] text-[#CBD5E1] font-sans font-normal leading-[1.8]">
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {/* Section Callout Box */}
                  {section.callout && (
                    <div
                      className={`p-6 rounded-2xl border space-y-3 my-6 ${
                        section.callout.type === "watch-out"
                          ? "bg-amber-950/15 border-amber-500/30 text-amber-200"
                          : section.callout.type === "worked-example"
                          ? "bg-slate-900/60 border-[#C9A96E]/30 text-[#CBD5E1]"
                          : "bg-[#090E1C] border-[#C9A96E]/40 text-[#CBD5E1]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {section.callout.type === "watch-out" ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        ) : section.callout.type === "worked-example" ? (
                          <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
                        ) : (
                          <Lightbulb className="w-4 h-4 text-[#C9A96E]" />
                        )}
                        <h4 className="font-serif text-base text-[#F5F1E8] font-medium">
                          {section.callout.title}
                        </h4>
                      </div>
                      <div className="space-y-2 text-xs sm:text-sm leading-relaxed font-sans">
                        {section.callout.paragraphs.map((cp, cpIdx) => (
                          <p key={cpIdx}>{cp}</p>
                        ))}
                      </div>
                      {section.callout.mathFormula && (
                        <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] font-mono text-xs text-[#C9A96E] tabular-nums overflow-x-auto">
                          {section.callout.mathFormula}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Section Data Table */}
                  {section.table && (
                    <div className="space-y-2 my-6">
                      {section.table.caption && (
                        <p className="text-xs font-mono uppercase tracking-wider text-[#C9A96E]">
                          {section.table.caption}
                        </p>
                      )}
                      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] shadow-lg">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-[#090E1C] border-b border-white/[0.08]">
                              {section.table.headers.map((h, hIdx) => (
                                <th
                                  key={hIdx}
                                  className="py-3 px-4 font-mono font-medium text-[#C9A96E] text-xs uppercase tracking-wider"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.04]">
                            {section.table.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className="even:bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                              >
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`py-3 px-4 font-sans text-[#CBD5E1] ${
                                      cIdx === 0
                                        ? "font-medium text-[#F5F1E8]"
                                        : "tabular-nums"
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {section.table.footnote && (
                        <p className="text-[11px] font-sans text-slate-400 italic">
                          {section.table.footnote}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Section Chart */}
                  {section.chart && <InsightChartRenderer chart={section.chart} />}
                </section>
              ))}

              {/* Dedicated Worked Example Card */}
              {article.workedExample?.scenario && (
                <section
                  id="worked-example"
                  data-toc-target="true"
                  className="space-y-6 pt-4 scroll-mt-28"
                >
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#090E1C] border border-[#C9A96E]/40 space-y-6 shadow-xl">
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                        Mathematical Demonstration
                      </span>
                      <h3 className="font-serif text-2xl text-[#F5F1E8]">
                        {article.workedExample.title}
                      </h3>
                      {article.workedExample.subtitle && (
                        <p className="text-xs font-mono text-slate-400">
                          {article.workedExample.subtitle}
                        </p>
                      )}
                    </div>

                    <p className="text-sm text-[#CBD5E1] font-sans leading-relaxed">
                      {article.workedExample.scenario}
                    </p>

                    {/* Stated Assumptions */}
                    <div className="space-y-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#C9A96E]">
                        Stated Model Assumptions
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                        {article.workedExample.assumptions.map((ass, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2">
                            <span className="text-[#C9A96E] font-bold">›</span>
                            <span>{ass}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Simulation Table */}
                    <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-black/40 border-b border-white/[0.08]">
                            {article.workedExample.table.headers.map((h, hIdx) => (
                              <th
                                key={hIdx}
                                className="py-2.5 px-3.5 font-mono text-[#C9A96E] uppercase tracking-wider"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {article.workedExample.table.rows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className="even:bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                            >
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`py-2.5 px-3.5 font-sans text-[#CBD5E1] ${
                                    cIdx === 0 ? "font-medium text-[#F5F1E8]" : "tabular-nums"
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Fiduciary Takeaway */}
                    <div className="p-4 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-xs sm:text-sm text-[#F5F1E8] font-sans leading-relaxed flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A96E] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#C9A96E]">Fiduciary Takeaway: </strong>
                        {article.workedExample.takeaway}
                      </span>
                    </div>
                  </div>
                </section>
              )}

              {/* Common Pitfalls Section */}
              {article.commonMistakes?.length > 0 && (
                <section
                  id="common-pitfalls"
                  data-toc-target="true"
                  className="space-y-6 pt-4 scroll-mt-28"
                >
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-normal border-b border-white/[0.08] pb-3">
                    Five Common Structural Pitfalls
                  </h2>
                  <div className="space-y-4">
                    {article.commonMistakes.map((item, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-5 rounded-2xl bg-[#090E1C] border border-white/[0.08] space-y-2.5"
                      >
                        <div className="flex items-center gap-2 text-sm font-sans font-medium text-[#F5F1E8]">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{item.mistake}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed pl-6">
                          <strong className="text-slate-300">The Reality: </strong>
                          {item.reality}
                        </p>
                        <p className="text-xs sm:text-sm text-[#C9A96E] font-sans leading-relaxed pl-6">
                          <strong className="text-[#EADFC7]">Fiduciary Remedy: </strong>
                          {item.fiduciaryRemedy}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Questions for Adviser Checklist */}
              {article.adviserChecklist?.length > 0 && (
                <section
                  id="adviser-questions"
                  data-toc-target="true"
                  className="space-y-6 pt-4 scroll-mt-28"
                >
                  <div className="p-7 sm:p-8 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-5">
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                        Due Diligence Checklist
                      </span>
                      <h3 className="font-serif text-2xl text-[#F5F1E8]">
                        Questions to Ask Your Wealth Manager
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {article.adviserChecklist.map((question, qIdx) => (
                        <div
                          key={qIdx}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                        >
                          <div className="w-5 h-5 rounded border border-[#C9A96E]/50 flex items-center justify-center text-[#C9A96E] text-xs font-bold shrink-0 mt-0.5">
                            ✓
                          </div>
                          <span className="text-xs sm:text-sm text-[#CBD5E1] font-sans leading-relaxed">
                            {question}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Academic & Regulatory Citations */}
              {article.sources?.length > 0 && (
                <section
                  id="sources-references"
                  data-toc-target="true"
                  className="space-y-6 pt-4 scroll-mt-28"
                >
                  <h3 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-normal border-b border-white/[0.08] pb-3">
                    Sources, Academic Papers &amp; Regulatory Citations
                  </h3>
                  <div className="space-y-3">
                    {article.sources.map((src, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-4 rounded-xl bg-[#090E1C] border border-white/[0.06] flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-[#C9A96E]">
                              {src.citationType}
                            </span>
                            <span className="text-xs font-mono text-slate-400">
                              {src.publisher} ({src.yearOrDate})
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-sans font-medium text-[#F5F1E8]">
                            {src.title}
                          </h4>
                        </div>
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-[#C9A96E] transition-colors p-1"
                            title="Verify source"
                            aria-label={`Verify source: ${src.title}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Downloadable PDF Box */}
              {post.downloadablePdf && (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-[#C9A96E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F1E8]">
                        {post.downloadablePdf.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        {post.downloadablePdf.fileName} · {post.downloadablePdf.fileSize} · PDF Whitepaper
                      </p>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="bg-[#C9A96E] hover:bg-[#d6af57] text-[#070B14] font-semibold text-xs uppercase px-5 py-4 rounded-xl shrink-0"
                  >
                    <a
                      href="/downloads/AIM-Three-Bucket-Retirement-Plan.pdf"
                      download="AIM-Three-Bucket-Retirement-Plan.pdf"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </a>
                  </Button>
                </div>
              )}

              {/* Share Bar */}
              <div className="share-bar p-5 rounded-2xl bg-[#090E1C] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Share2 className="w-4 h-4 text-[#C9A96E]" />
                  <span>Share Analysis:</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#C9A96E]/50 text-xs font-mono text-slate-300 hover:text-[#F5F1E8] transition-colors flex items-center gap-1.5"
                    title="Copy Link"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#C9A96E]" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-white/10 hover:border-[#C9A96E]/50 text-slate-400 hover:text-[#C9A96E] transition-colors"
                    title="Share on LinkedIn"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `${post.title} - ${shareUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#C9A96E]/50 text-xs font-mono text-slate-300 hover:text-[#F5F1E8] transition-colors flex items-center gap-1"
                    title="Share via WhatsApp"
                    aria-label="Share on WhatsApp"
                  >
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:?subject=${encodeURIComponent(
                      post.title
                    )}&body=${encodeURIComponent(
                      `I recommend reading this fiduciary analysis from Alpha Investment Management:\n\n${post.title}\n${shareUrl}`
                    )}`}
                    className="p-2 rounded-lg border border-white/10 hover:border-[#C9A96E]/50 text-slate-400 hover:text-[#C9A96E] transition-colors"
                    title="Share via Email"
                    aria-label="Share via Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Author Box (Strictly Text-Only, NO Avatars) */}
              <div className="p-7 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                    About the Author
                  </span>
                  <Link
                    to="/about"
                    className="text-xs font-mono text-[#C9A96E] hover:text-[#DFCA9F] flex items-center gap-1"
                  >
                    <span>Firm Governance</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
                <div>
                  <h4 className="font-serif text-xl text-[#F5F1E8] font-normal">
                    {article.author.name}
                  </h4>
                  <p className="text-xs text-[#C9A96E] font-mono">
                    {article.author.role} · {article.author.credentials}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                  {article.author.bio}
                </p>
              </div>

              {/* Prev / Next Article Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/[0.08]">
                <Link
                  to={`/insights/${prevPost.slug}`}
                  className="p-5 rounded-2xl bg-[#090E1C] border border-white/[0.08] hover:border-[#C9A96E]/40 transition-colors space-y-2 group block"
                >
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 group-hover:text-[#C9A96E] transition-colors">
                    <ArrowLeft className="w-3 h-3" /> Previous Analysis
                  </span>
                  <h5 className="font-serif text-sm sm:text-base text-[#F5F1E8] leading-snug line-clamp-2">
                    {prevPost.title}
                  </h5>
                </Link>

                <Link
                  to={`/insights/${nextPost.slug}`}
                  className="p-5 rounded-2xl bg-[#090E1C] border border-white/[0.08] hover:border-[#C9A96E]/40 transition-colors space-y-2 group block text-right"
                >
                  <span className="text-[10px] font-mono text-slate-400 flex items-center justify-end gap-1 group-hover:text-[#C9A96E] transition-colors">
                    Next Analysis <ArrowRight className="w-3 h-3" />
                  </span>
                  <h5 className="font-serif text-sm sm:text-base text-[#F5F1E8] leading-snug line-clamp-2">
                    {nextPost.title}
                  </h5>
                </Link>
              </div>

              {/* Statutory Compliance Footer Box */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                  Statutory Research Disclosure
                </span>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {INSIGHTS_COMPLIANCE_DISCLOSURE}
                </p>
              </div>
            </article>

            {/* Desktop Sticky Table of Contents Rail (Col-span-4) */}
            <aside className="table-of-contents-rail hidden lg:block lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="p-6 rounded-3xl bg-[#090E1C] border border-white/[0.08] space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                    <BookOpen className="w-4 h-4 text-[#C9A96E]" />
                    <span>Table of Contents</span>
                  </div>

                  <nav className="space-y-1.5 text-xs">
                    {tocItems.map((item) => {
                      const isActive = activeSectionId === item.id;
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block py-1.5 px-3 rounded-lg font-sans transition-all duration-150 leading-snug ${
                            isActive
                              ? "bg-[#C9A96E]/10 text-[#C9A96E] font-medium border-l-2 border-[#C9A96E]"
                              : "text-slate-400 hover:text-[#F5F1E8] hover:bg-white/[0.02]"
                          }`}
                        >
                          {item.label}
                        </a>
                      );
                    })}
                  </nav>
                </div>

                {/* Consultation Mini-Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#090E1C] to-[#070B14] border border-[#C9A96E]/30 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A96E]">
                    Fiduciary Consultation
                  </span>
                  <h4 className="font-serif text-lg text-[#F5F1E8]">
                    Review Your Multi-Asset Portfolio
                  </h4>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Zero distributor commissions. Zero product sales. Dedicated fee-only wealth stewardship.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-[#C9A96E] hover:bg-[#d6af57] text-[#070B14] font-medium text-xs uppercase rounded-xl py-3"
                  >
                    <Link to="/contact">Schedule Portfolio Audit</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Articles Section (Static Cards, Image-Only Hover) */}
        {relatedPosts.length > 0 && (
          <section className="related-articles-section container mx-auto px-6 sm:px-10 lg:px-16 max-w-6xl pt-20 border-t border-white/[0.08] mt-16 space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                Related Advisory Perspectives
              </span>
              <Link
                to="/insights"
                className="text-xs font-mono text-slate-400 hover:text-[#C9A96E] transition-colors flex items-center gap-1"
              >
                <span>View All Analyses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => {
                const relReadTime = computeReadTime(rel);
                return (
                  <div
                    key={rel.slug}
                    className="rounded-3xl bg-[#090E1C] border border-white/[0.08] overflow-hidden flex flex-col justify-between"
                  >
                    <Link to={`/insights/${rel.slug}`} className="block">
                      <InsightCover
                        category={rel.category}
                        title={rel.title}
                        coverImage={rel.coverImage}
                        coverImageSrcSet={rel.coverImageSrcSet}
                        altText={rel.imageMetadata?.altText}
                        variant="grid"
                        className="h-[180px] w-full"
                      />
                    </Link>

                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span className="text-[#C9A96E]">{rel.category}</span>
                          <span className="tabular-nums">{relReadTime}</span>
                        </div>
                        <Link to={`/insights/${rel.slug}`} className="block group">
                          <h4 className="font-serif text-lg text-[#F5F1E8] group-hover:text-[#C9A96E] transition-colors leading-snug line-clamp-2">
                            {rel.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                          {rel.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                        <span className="text-[#CBD5E1] font-sans">By {rel.author.name}</span>
                        <Link
                          to={`/insights/${rel.slug}`}
                          className="font-mono text-xs text-[#C9A96E] hover:text-[#DFCA9F] flex items-center gap-1"
                        >
                          <span>Read</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Closing Advisory Consultation Banner */}
        <section className="advisory-cta-band container mx-auto px-6 sm:px-10 lg:px-16 max-w-6xl pt-16">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0B1220] via-[#090E1C] to-[#070B14] border border-[#C9A96E]/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-3 max-w-xl">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                Fiduciary Wealth Stewardship
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-normal leading-snug">
                Align Your Capital with SEBI Registered Fiduciary Care
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Discover the compounded advantage of zero distributor commissions, quantitative rebalancing corridors, and bespoke capital gains tax architecture.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
              <Button
                asChild
                className="w-full sm:w-auto bg-[#C9A96E] hover:bg-[#d6af57] text-[#070B14] font-medium text-xs uppercase tracking-wider rounded-xl px-6 py-5"
              >
                <Link to="/contact">Book Fiduciary Audit</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto border-white/10 hover:border-[#C9A96E] text-xs font-mono rounded-xl px-5 py-5 text-[#F5F1E8] bg-transparent"
              >
                <Link to="/calculators">Explore Calculators</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
