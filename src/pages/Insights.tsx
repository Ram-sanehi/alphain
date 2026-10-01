import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { StockTicker } from "@/components/StockTicker";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Clock,
  Calendar,
  ArrowRight,
  BookOpen,
  Search,
  X,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";
import {
  INSIGHTS_POSTS,
  InsightPost,
  InsightCategory,
  computeReadTime,
  INSIGHTS_COMPLIANCE_DISCLOSURE,
} from "@/data/insightsData";
import { InsightCover } from "@/components/insights/InsightCover";

const CATEGORIES: (InsightCategory | "All")[] = [
  "All",
  "Market Commentary",
  "Fiduciary Wealth",
  "Tax Optimization",
  "Retirement Planning",
  "Asset Allocation",
];

const PAGE_SIZE = 9;

/**
 * Text highlight helper for search matches
 */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || !query.trim()) return text;
  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-[#C9A96E]/25 text-[#F5F1E8] font-normal px-0.5 rounded"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/**
 * Dynamic 12-column grid span allocator that mathematically guarantees
 * ZERO lonely orphan cards under any number of items (4, 5, 6, 7, 12, 50).
 */
export function getGridCardSpan(index: number, total: number): {
  colSpanClass: string;
  isLargeCard: boolean;
  isSpotlight: boolean;
} {
  // If only 1 card total, span full width
  if (total === 1) {
    return { colSpanClass: "lg:col-span-12", isLargeCard: true, isSpotlight: true };
  }
  // If 2 cards, 6 cols each (1 row of 2)
  if (total === 2) {
    return { colSpanClass: "lg:col-span-6", isLargeCard: true, isSpotlight: false };
  }
  // If 3 cards, 4 cols each (1 row of 3)
  if (total === 3) {
    return { colSpanClass: "lg:col-span-4", isLargeCard: false, isSpotlight: false };
  }
  // If 4 cards, 2 rows of 2 (6 cols each) so neither row is an orphan!
  if (total === 4) {
    return { colSpanClass: "lg:col-span-6", isLargeCard: false, isSpotlight: false };
  }

  // For total >= 5:
  // First 2 cards are always larger cards (6 columns each)
  if (index === 0 || index === 1) {
    return { colSpanClass: "lg:col-span-6", isLargeCard: true, isSpotlight: false };
  }

  // Remaining cards start at index 2 (count = total - 2)
  const remainingCount = total - 2;
  const remIndex = index - 2;
  const remainder = remainingCount % 3;

  if (remainder === 0) {
    // Exactly fills rows of 3 (4 cols each)
    return { colSpanClass: "lg:col-span-4", isLargeCard: false, isSpotlight: false };
  } else if (remainder === 1) {
    // 1 extra card at the end. Make the last card span 12 cols as a spotlight feature!
    if (remIndex === remainingCount - 1) {
      return { colSpanClass: "lg:col-span-12", isLargeCard: true, isSpotlight: true };
    }
    return { colSpanClass: "lg:col-span-4", isLargeCard: false, isSpotlight: false };
  } else {
    // remainder === 2 (2 extra cards at the end). Make the last two cards span 6 cols each!
    if (remIndex >= remainingCount - 2) {
      return { colSpanClass: "lg:col-span-6", isLargeCard: false, isSpotlight: false };
    }
    return { colSpanClass: "lg:col-span-4", isLargeCard: false, isSpotlight: false };
  }
}

export default function Insights() {
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  // URL state synchronization
  const selectedCategory = (searchParams.get("category") as InsightCategory | "All") || "All";
  const searchQuery = searchParams.get("q") || "";
  const sortMode = (searchParams.get("sort") as "newest" | "readTime") || "newest";

  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === "All" || (key === "sort" && value === "newest")) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams, { replace: true });
    setVisibleCount(PAGE_SIZE);
  };

  const handleResetFilters = () => {
    setSearchParams({}, { replace: true });
    setVisibleCount(PAGE_SIZE);
  };

  // Category counts across entire publication
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: INSIGHTS_POSTS.length };
    for (const post of INSIGHTS_POSTS) {
      counts[post.category] = (counts[post.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtered and sorted posts
  const filteredAndSortedPosts = useMemo(() => {
    const filtered = INSIGHTS_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortMode === "readTime") {
        const timeA = parseInt(computeReadTime(a)) || 0;
        const timeB = parseInt(computeReadTime(b)) || 0;
        return timeB - timeA;
      }
      // Default: newest first by ISO date
      const dateA = a.publishedIsoDate ? new Date(a.publishedIsoDate).getTime() : 0;
      const dateB = b.publishedIsoDate ? new Date(b.publishedIsoDate).getTime() : 0;
      return dateB - dateA;
    });
  }, [selectedCategory, searchQuery, sortMode]);

  // Featured story separation:
  // When there are matching posts, the top post is featured,
  // and the remaining posts form the grid.
  // The featured article is NEVER duplicated in the grid below!
  const hasPosts = filteredAndSortedPosts.length > 0;
  const featuredPost = hasPosts ? filteredAndSortedPosts[0] : null;
  const allGridPosts = hasPosts ? filteredAndSortedPosts.slice(1) : [];
  const visibleGridPosts = allGridPosts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F1E8] flex flex-col selection:bg-[#C9A96E]/30 selection:text-[#F5F1E8] overflow-x-hidden">
      <Navbar />
      <StockTicker />

      <main className="flex-1">
        {/* =========================================================
            1. HERO SECTION: Editorial Masthead
           ========================================================= */}
        <section className="relative pt-24 pb-10 sm:pt-32 sm:pb-14 border-b border-white/[0.08] overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#C9A96E]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl relative z-10 space-y-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[10px] font-mono uppercase tracking-[0.25em] text-[#C9A96E]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fiduciary Perspectives &amp; Market Research</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F5F1E8] leading-[1.12]">
                Institutional insights <br />
                <span className="italic text-[#C9A96E]">for long-term capital.</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base font-sans font-light max-w-2xl leading-relaxed">
                Disciplined macro commentary, tax-loss harvesting frameworks, and conflict-free wealth governance authored by our SEBI-registered advisory committee in Pune.
              </p>

              {/* Live Count Line in Monospace Type */}
              <div className="pt-1 flex items-center gap-3 text-xs font-mono text-[#A8B0BD]">
                <span className="text-[#C9A96E] font-medium">
                  {INSIGHTS_POSTS.length} analyses
                </span>
                <span>·</span>
                <span>Updated Sept 2026</span>
                <span>·</span>
                <span className="hidden sm:inline">SEBI Registered RIA INA000017348</span>
              </div>
            </div>

            {/* Filter, Search & Sort Bar */}
            <div className="pt-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Horizontally scrollable Category Pills with Snap and Tap Target sizing */}
              <nav
                aria-label="Publication category filters"
                role="tablist"
                className="flex items-center gap-1.5 overflow-x-auto snap-x scroll-smooth no-scrollbar p-1.5 rounded-2xl bg-[#090E1C] border border-white/[0.08]"
              >
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  const count = categoryCounts[cat] || 0;

                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => updateParam("category", cat)}
                      className={`relative min-h-[44px] px-4 py-2 rounded-xl text-xs font-sans transition-all whitespace-nowrap snap-start select-none flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:outline-none ${
                        isActive
                          ? "text-[#070B14] font-semibold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryPill"
                          className="absolute inset-0 bg-[#C9A96E] rounded-xl shadow-md"
                          transition={{
                            type: shouldReduceMotion ? false : "spring",
                            stiffness: 400,
                            damping: 32,
                          }}
                        />
                      )}
                      <span className="relative z-10">{cat}</span>
                      <span
                        className={`relative z-10 font-mono text-[10px] tabular-nums ${
                          isActive ? "text-[#070B14]/80" : "text-slate-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Search Box and Sort Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Live Search Input with Clear Button */}
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search commentary, tax, SWP..."
                    value={searchQuery}
                    onChange={(e) => updateParam("q", e.target.value)}
                    className="w-full min-h-[44px] bg-[#090E1C] border border-white/[0.08] rounded-xl pl-10 pr-9 py-2 text-xs text-[#F5F1E8] placeholder:text-slate-500 focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E] focus:outline-none transition-all"
                    aria-label="Search analyses by keyword"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => updateParam("q", "")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                      aria-label="Clear search input"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="relative shrink-0">
                  <select
                    value={sortMode}
                    onChange={(e) => updateParam("sort", e.target.value)}
                    className="min-h-[44px] appearance-none bg-[#090E1C] border border-white/[0.08] rounded-xl pl-4 pr-9 py-2 text-xs text-slate-300 font-sans focus:border-[#C9A96E] focus:outline-none cursor-pointer"
                    aria-label="Sort research articles"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="readTime">Sort: Most Read Time</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Live Search Result Count Region */}
            <div
              aria-live="polite"
              className="text-[11px] font-mono text-[#A8B0BD] pt-1 flex items-center justify-between"
            >
              <span>
                Showing {filteredAndSortedPosts.length} of {INSIGHTS_POSTS.length} analyses
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
              {(selectedCategory !== "All" || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[#C9A96E] hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            2. FEATURED STORY (Large Full-Width Editorial Feature)
           ========================================================= */}
        {featuredPost && (
          <section className="py-12 border-b border-white/[0.06] relative">
            <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A96E] block mb-4">
                Lead Research Publication
              </span>

              {/* Large Editorial Feature Container with Soft Radial Gold Glow (Static Appearance, No Card Hover Shift) */}
              <div className="relative rounded-3xl bg-[#090E1C] border border-white/[0.08] overflow-hidden p-6 sm:p-10 lg:p-12 shadow-2xl">
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                  {/* Left Column: Editorial Details */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* Meta Line with Tabular Numerals & Gold Hairline Dividers */}
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#CBD5E1]">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/30 text-[#C9A96E] font-medium text-[11px]">
                        {featuredPost.category}
                      </span>
                      <span className="text-[#C9A96E]/50">·</span>
                      <span className="flex items-center gap-1.5 tabular-nums text-[#CBD5E1]">
                        <Clock className="w-3.5 h-3.5 text-[#C9A96E]" /> {computeReadTime(featuredPost)}
                      </span>
                      <span className="text-[#C9A96E]/50">·</span>
                      <span className="tabular-nums text-[#CBD5E1]">
                        <time dateTime={featuredPost.publishedIsoDate || featuredPost.publishedDate}>
                          {featuredPost.publishedDate}
                        </time>
                      </span>
                    </div>

                    {/* Big Serif Headline (Static Color, No Hover Dimming or Shift) */}
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5F1E8] font-normal leading-[1.18]">
                      <Link
                        to={`/insights/${featuredPost.slug}`}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] rounded-md"
                      >
                        {highlightMatch(featuredPost.title, searchQuery)}
                      </Link>
                    </h2>

                    {/* Excerpt with WCAG AA High-Contrast text */}
                    <p className="text-sm sm:text-base text-[#CBD5E1] font-sans font-normal leading-relaxed">
                      {highlightMatch(featuredPost.excerpt, searchQuery)}
                    </p>

                    {/* Author Byline (Text Only) & Read Analysis CTA */}
                    <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/[0.08]">
                      <div className="space-y-0.5">
                        <p className="font-mono text-xs text-[#CBD5E1]">
                          By {featuredPost.author.name}
                        </p>
                        {featuredPost.author.role && (
                          <p className="text-[11px] text-[#B0BAC9] font-sans font-normal">
                            {featuredPost.author.role}
                          </p>
                        )}
                      </div>

                      <Button
                        asChild
                        className="bg-[#C9A96E] hover:bg-[#d8b97e] text-[#070B14] font-semibold text-xs uppercase tracking-wider px-6 py-5 rounded-xl shadow-lg shadow-[#C9A96E]/20 min-h-[44px]"
                      >
                        <Link
                          to={`/insights/${featuredPost.slug}`}
                          className="flex items-center gap-2"
                        >
                          <span>Read Analysis</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Photo Cover with Grayscale-to-Colour on Image Hover (4/3 aspect ratio) */}
                  <div className="lg:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-xl">
                    <Link
                      to={`/insights/${featuredPost.slug}`}
                      aria-label={`Read ${featuredPost.title}`}
                      className="insight-card-link block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] rounded-2xl"
                    >
                      <InsightCover
                        category={featuredPost.category}
                        title={featuredPost.title}
                        coverImage={featuredPost.coverImage}
                        coverImageSrcSet={featuredPost.coverImageSrcSet}
                        altText={featuredPost.imageMetadata?.altText}
                        variant="featured"
                        priority={true}
                        className="w-full h-full rounded-2xl"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            3. REFINED EDITORIAL GRID (Zero Lonely Orphan Cards)
           ========================================================= */}
        <section className="py-14 sm:py-20">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl space-y-8">
            {/* If no articles match query/filter */}
            {!hasPosts ? (
              <div className="text-center py-20 px-6 rounded-3xl bg-[#090E1C] border border-white/[0.08] max-w-xl mx-auto space-y-4">
                <BookOpen className="w-12 h-12 text-[#C9A96E] mx-auto opacity-70" />
                <h3 className="font-serif text-2xl text-[#F5F1E8]">No analyses match</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                  We could not find any research matching your current filter or search criteria. Try a different term or reset filters.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={handleResetFilters}
                    className="bg-[#C9A96E] hover:bg-[#d8b97e] text-[#070B14] font-semibold text-xs uppercase px-6 py-5 rounded-xl min-h-[44px]"
                  >
                    Reset Filters &amp; Search
                  </Button>
                </div>
              </div>
            ) : allGridPosts.length === 0 ? (
              // When only 1 post matched (rendered as featured)
              <div className="text-center py-8 text-xs font-mono text-[#A8B0BD]">
                All matching research shown above in lead publication.
              </div>
            ) : (
              // 12-Column Responsive Editorial Grid
              <>
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                    Advisory Analyses &amp; Policy Briefs ({allGridPosts.length})
                  </span>
                  <span className="text-[10px] font-mono text-[#A8B0BD] hidden sm:inline">
                    Fee-Only Research Publications
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-stretch">
                  {visibleGridPosts.map((post, idx) => {
                    const spanInfo = getGridCardSpan(idx, visibleGridPosts.length);

                    return (
                      <article
                        key={post.slug}
                        className={`col-span-1 md:col-span-1 ${spanInfo.colSpanClass} flex flex-col h-full`}
                      >
                        <Link
                          to={`/insights/${post.slug}`}
                          className={`insight-card-link flex flex-col justify-between h-full p-6 sm:p-7 rounded-3xl bg-[#090E1C] border border-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:border-[#C9A96E] select-none ${
                            spanInfo.isSpotlight ? "lg:flex-row lg:items-center lg:gap-8" : ""
                          }`}
                        >
                          {/* Card Thumbnail / Curated Photo Cover with 16:9 Aspect Ratio */}
                          <div
                            className={`rounded-2xl overflow-hidden relative border border-white/10 shrink-0 ${
                              spanInfo.isSpotlight
                                ? "lg:w-5/12 aspect-[16/9] w-full"
                                : "w-full mb-5 aspect-[16/9]"
                            }`}
                          >
                            <InsightCover
                              category={post.category}
                              title={post.title}
                              coverImage={post.coverImage}
                              coverImageSrcSet={post.coverImageSrcSet}
                              altText={post.imageMetadata?.altText}
                              variant={spanInfo.isLargeCard ? "featured" : "card"}
                              className="w-full h-full"
                            />
                          </div>

                          {/* Text Block */}
                          <div className={`space-y-3.5 flex-1 flex flex-col justify-between ${spanInfo.isSpotlight ? "lg:w-7/12" : ""}`}>
                            <div className="space-y-2.5">
                              {/* Meta: Read Time & Date in Mono Type (WCAG AA compliant contrast) */}
                              <div className="flex items-center gap-2.5 text-[11px] font-mono text-[#CBD5E1]">
                                <span className="flex items-center gap-1 text-[#C9A96E] tabular-nums font-medium">
                                  <Clock className="w-3 h-3 text-[#C9A96E]" /> {computeReadTime(post)}
                                </span>
                                <span className="text-[#C9A96E]/50">·</span>
                                <span className="tabular-nums text-[#CBD5E1]">
                                  <time dateTime={post.publishedIsoDate || post.publishedDate}>
                                    {post.publishedDate}
                                  </time>
                                </span>
                              </div>

                              {/* Title (Static Color, No Hover Dimming or Shift) */}
                              <h3
                                className={`font-serif text-[#F5F1E8] font-normal leading-snug ${
                                  spanInfo.isSpotlight
                                    ? "text-2xl sm:text-3xl"
                                    : spanInfo.isLargeCard
                                    ? "text-2xl sm:text-3xl"
                                    : "text-xl sm:text-2xl"
                                }`}
                              >
                                {highlightMatch(post.title, searchQuery)}
                              </h3>

                              {/* Excerpt with WCAG AA High-Contrast text */}
                              <p className="text-xs sm:text-sm text-[#CBD5E1] font-sans font-normal line-clamp-3 leading-relaxed">
                                {highlightMatch(post.excerpt, searchQuery)}
                              </p>
                            </div>

                            {/* Author Byline (Text Only: "By Name") & Read CTA (Static) */}
                            <div className="pt-4 border-t border-white/[0.06] mt-4 flex items-center justify-between">
                              <span className="text-xs text-[#CBD5E1] font-mono">
                                By {post.author.name}
                              </span>

                              <span className="inline-flex items-center gap-1.5 text-xs text-[#C9A96E] font-mono">
                                <span>Read</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>

                {/* "Load More" Control if more than PAGE_SIZE items */}
                {allGridPosts.length > visibleCount && (
                  <div className="text-center pt-8">
                    <Button
                      onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                      variant="outline"
                      className="border-white/10 hover:border-[#C9A96E] text-xs font-mono uppercase tracking-wider px-8 py-5 rounded-xl min-h-[44px]"
                    >
                      Load More Analyses ({allGridPosts.length - visibleCount} remaining)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* =========================================================
            4. CLOSING ADVISORY BAND (Premium Call-to-Action Strip)
           ========================================================= */}
        <section className="py-16 sm:py-20 border-t border-b border-white/[0.08] bg-gradient-to-b from-[#090E1C] to-[#070B14] relative overflow-hidden">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-5xl text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[10px] font-mono uppercase tracking-[0.25em] text-[#C9A96E]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct Fiduciary Consultation</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5F1E8] font-normal leading-tight max-w-3xl mx-auto">
              Discuss your portfolio with our advisory committee
            </h2>

            <p className="text-slate-300 text-sm sm:text-base font-sans font-light max-w-2xl mx-auto leading-relaxed">
              Schedule a comprehensive review with our SEBI Registered Investment Advisers in Pune. Independent portfolio diagnostics, risk calibration, and direct securities execution.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="bg-[#C9A96E] hover:bg-[#d8b97e] text-[#070B14] font-semibold text-xs uppercase tracking-wider px-8 py-5 rounded-xl shadow-lg shadow-[#C9A96E]/20 min-h-[44px]"
              >
                <Link to="/contact">Book a Consultation</Link>
              </Button>
            </div>

            <p className="text-[11px] font-mono uppercase tracking-wider text-[#A8B0BD] pt-2">
              No commissions. No product sales. 100% fiduciary alignment.
            </p>
          </div>
        </section>

        {/* =========================================================
            5. STATUTORY COMPLIANCE FOOTER FOR THIS PUBLICATION
           ========================================================= */}
        <section className="py-10 bg-[#070B14] border-b border-white/[0.06]">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl">
            <div className="p-6 rounded-2xl bg-[#090E1C]/60 border border-white/[0.08] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A96E]">
                Statutory Fiduciary Disclosure
              </span>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {INSIGHTS_COMPLIANCE_DISCLOSURE}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
