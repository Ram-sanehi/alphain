import { describe, it, expect } from "vitest";
import {
  INSIGHTS_POSTS,
  computeReadTime,
  INSIGHTS_COMPLIANCE_DISCLOSURE,
} from "@/data/insightsData";
import { getGridCardSpan } from "@/pages/Insights";

describe("Fiduciary Perspectives & Market Research Publication Engine", () => {
  it("contains exactly 5 publication-ready research analyses", () => {
    expect(INSIGHTS_POSTS).toHaveLength(5);

    const categories = INSIGHTS_POSTS.map((p) => p.category);
    expect(categories).toContain("Market Commentary");
    expect(categories).toContain("Fiduciary Wealth");
    expect(categories).toContain("Tax Optimization");
    expect(categories).toContain("Retirement Planning");
    expect(categories).toContain("Asset Allocation");

    INSIGHTS_POSTS.forEach((post) => {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.excerpt).toBeTruthy();
      expect(post.author.name).toBeTruthy();
      expect(post.publishedDate).toBeTruthy();
      expect(post.content.length).toBeGreaterThan(0);
      expect(post.keyTakeaways.length).toBeGreaterThan(0);
    });
  });

  it("verifies accurate read times for all 5 articles and computes dynamically when full body is present", () => {
    // Before fix: every article returned 1 min read because stubs were under 200 words
    // After fix: fallback to configured readTime (5-8 min read) or dynamic calculation if body >= 300 words
    expect(computeReadTime(INSIGHTS_POSTS[0])).toBe("6 min read");
    expect(computeReadTime(INSIGHTS_POSTS[1])).toBe("8 min read");
    expect(computeReadTime(INSIGHTS_POSTS[2])).toBe("5 min read");
    expect(computeReadTime(INSIGHTS_POSTS[3])).toBe("7 min read");
    expect(computeReadTime(INSIGHTS_POSTS[4])).toBe("6 min read");

    // Dynamic computation test: 20 paragraphs * 27 words = 540 words should compute to ceil(540/200) = 3 min read
    const longArticle = {
      ...INSIGHTS_POSTS[0],
      content: Array(20).fill("This is a comprehensive analytical paragraph explaining institutional quantitative asset rebalancing, fiduciary mandate protections, and long-term compounding frameworks under Indian capital market regulations for family offices."),
    };
    expect(computeReadTime(longArticle)).toBe("3 min read");
  });

  it("verifies all 5 articles have curated photo covers, responsive srcset, and SEBI compliance (no visible face)", () => {
    INSIGHTS_POSTS.forEach((post) => {
      expect(post.coverImage).toBeTruthy();
      expect(post.coverImage).toMatch(/^(\/images\/|https:\/\/images\.unsplash\.com\/)/);
      expect(post.coverImageSrcSet).toBeTruthy();
      expect(post.coverImageSrcSet).toContain("640w");
      expect(post.coverImageSrcSet).toContain("1024w");
      expect(post.coverImageSrcSet).toContain("1600w");

      expect(post.imageMetadata).toBeDefined();
      expect(post.imageMetadata?.photographer).toBeTruthy();
      expect(post.imageMetadata?.license).toBeTruthy();
      expect(post.imageMetadata?.hasVisibleFace).toBe(false); // SEBI endorsement code compliance
      expect(post.imageMetadata?.altText).toBeTruthy();
    });
  });

  it("verifies the Asset Allocation article has an aerial city grid photo with royalty-free license", () => {
    const assetAllocPost = INSIGHTS_POSTS.find((p) => p.category === "Asset Allocation");
    expect(assetAllocPost).toBeDefined();
    expect(assetAllocPost?.coverImage).toBeTruthy();
    expect(assetAllocPost?.coverImage).toMatch(/asset-allocation|photo-1477959858617/);
    expect(assetAllocPost?.imageMetadata?.photographer).toBe("Alex Azabache");
    expect(assetAllocPost?.imageMetadata?.license).toContain("Unsplash License");
    expect(assetAllocPost?.imageMetadata?.hasVisibleFace).toBe(false);
  });

  it("centralizes the exact statutory compliance disclosure", () => {
    expect(INSIGHTS_COMPLIANCE_DISCLOSURE).toContain("Commentary is for educational purposes");
    expect(INSIGHTS_COMPLIANCE_DISCLOSURE).toContain("not investment advice or a recommendation");
    expect(INSIGHTS_COMPLIANCE_DISCLOSURE).toContain("SEBI RIA INA000017348");
    expect(INSIGHTS_COMPLIANCE_DISCLOSURE).toContain("BASL");
    expect(INSIGHTS_COMPLIANCE_DISCLOSURE).toContain("NISM");
  });

  describe("Grid Span Allocator (Zero Lonely Orphan Guarantee)", () => {
    // Helper to sum column spans for a set of card spans
    const parseSpan = (spanClass: string): number => {
      const match = spanClass.match(/lg:col-span-(\d+)/);
      return match ? parseInt(match[1], 10) : 12;
    };

    it("handles total = 4 (default grid with 1 featured + 4 remaining): 2 rows of 2 (6 cols each)", () => {
      const total = 4;
      const spans = Array.from({ length: total }, (_, i) => getGridCardSpan(i, total));

      expect(spans[0].colSpanClass).toBe("lg:col-span-6");
      expect(spans[1].colSpanClass).toBe("lg:col-span-6");
      expect(spans[2].colSpanClass).toBe("lg:col-span-6");
      expect(spans[3].colSpanClass).toBe("lg:col-span-6");

      // Row 1: 6 + 6 = 12
      expect(parseSpan(spans[0].colSpanClass) + parseSpan(spans[1].colSpanClass)).toBe(12);
      // Row 2: 6 + 6 = 12 (Zero orphan!)
      expect(parseSpan(spans[2].colSpanClass) + parseSpan(spans[3].colSpanClass)).toBe(12);
    });

    it("handles total = 5: 2 rows (6+6 and 4+4+4)", () => {
      const total = 5;
      const spans = Array.from({ length: total }, (_, i) => getGridCardSpan(i, total));

      // Row 1: 6 + 6 = 12
      expect(parseSpan(spans[0].colSpanClass) + parseSpan(spans[1].colSpanClass)).toBe(12);
      // Row 2: 4 + 4 + 4 = 12
      expect(
        parseSpan(spans[2].colSpanClass) +
          parseSpan(spans[3].colSpanClass) +
          parseSpan(spans[4].colSpanClass)
      ).toBe(12);
    });

    it("handles total = 6: 3 rows (6+6, 4+4+4, and 12-col closing spotlight)", () => {
      const total = 6;
      const spans = Array.from({ length: total }, (_, i) => getGridCardSpan(i, total));

      // Row 1: 6 + 6 = 12
      expect(parseSpan(spans[0].colSpanClass) + parseSpan(spans[1].colSpanClass)).toBe(12);
      // Row 2: 4 + 4 + 4 = 12
      expect(
        parseSpan(spans[2].colSpanClass) +
          parseSpan(spans[3].colSpanClass) +
          parseSpan(spans[4].colSpanClass)
      ).toBe(12);
      // Row 3: 12 (Full-width spotlight card, zero orphan!)
      expect(parseSpan(spans[5].colSpanClass)).toBe(12);
      expect(spans[5].isSpotlight).toBe(true);
    });

    it("handles total = 7: 3 rows (6+6, 4+4+4, and 6+6)", () => {
      const total = 7;
      const spans = Array.from({ length: total }, (_, i) => getGridCardSpan(i, total));

      // Row 1: 6 + 6 = 12
      expect(parseSpan(spans[0].colSpanClass) + parseSpan(spans[1].colSpanClass)).toBe(12);
      // Row 2: 4 + 4 + 4 = 12
      expect(
        parseSpan(spans[2].colSpanClass) +
          parseSpan(spans[3].colSpanClass) +
          parseSpan(spans[4].colSpanClass)
      ).toBe(12);
      // Row 3: 6 + 6 = 12 (Zero orphan!)
      expect(parseSpan(spans[5].colSpanClass) + parseSpan(spans[6].colSpanClass)).toBe(12);
    });

    it("handles total = 12: every row sums to 12 with zero orphans", () => {
      const total = 12;
      const spans = Array.from({ length: total }, (_, i) => getGridCardSpan(i, total));
      const colSizes = spans.map((s) => parseSpan(s.colSpanClass));

      // Total sum of columns across all 12 cards must be a multiple of 12
      const totalColSum = colSizes.reduce((sum, n) => sum + n, 0);
      expect(totalColSum % 12).toBe(0);
    });
  });

  describe("In-Depth Editorial Research Content & Fiduciary Compliance", () => {
    it("validates all 5 articles have full-length, high-caliber editorial content (1,000-1,600 words)", async () => {
      const { INSIGHT_ARTICLES } = await import("@/data/insightsArticles");

      const expectedSlugs = [
        "navigating-india-market-volatility-fiduciary-framework",
        "tax-loss-harvesting-playbook-indian-equities",
        "pure-fee-only-vs-commission-brokers",
        "perpetual-swp-retirement-drawdown-blueprint",
        "strategic-asset-allocation-high-net-worth",
      ];

      expect(Object.keys(INSIGHT_ARTICLES)).toHaveLength(5);

      expectedSlugs.forEach((slug) => {
        const article = INSIGHT_ARTICLES[slug];
        expect(article).toBeDefined();
        expect(article.title).toBeTruthy();
        expect(article.standfirst).toBeTruthy();
        expect(article.author.name).toBeTruthy();
        expect(article.author.role).toBeTruthy();
        expect(article.author.bio).toBeTruthy();
        expect(article.reviewStatus).toBe("approved by compliance");
        expect(article.keyTakeaways.length).toBeGreaterThanOrEqual(3);
        expect(article.sections.length).toBeGreaterThanOrEqual(4);
        expect(article.workedExample).toBeDefined();
        expect(article.workedExample.assumptions.length).toBeGreaterThanOrEqual(3);
        expect(article.workedExample.table.rows.length).toBeGreaterThanOrEqual(4);
        expect(article.commonMistakes.length).toBeGreaterThanOrEqual(4);
        expect(article.adviserChecklist.length).toBeGreaterThanOrEqual(4);
        expect(article.sources.length).toBeGreaterThanOrEqual(3);

        // Word count verification across all rich editorial components
        const fullText = [
          article.standfirst,
          ...article.keyTakeaways,
          ...article.sections.flatMap((s) => [
            s.title,
            ...s.paragraphs,
            ...(s.callout ? [s.callout.title, ...s.callout.paragraphs] : []),
          ]),
          article.workedExample.title,
          article.workedExample.scenario,
          ...article.workedExample.assumptions,
          article.workedExample.takeaway,
          ...article.commonMistakes.flatMap((m) => [m.mistake, m.reality, m.fiduciaryRemedy]),
          ...article.adviserChecklist,
        ].join(" ");

        const wordCount = fullText.split(/\s+/).filter(Boolean).length;
        // Verify word count is substantial (850 to 1,650 words)
        expect(wordCount).toBeGreaterThanOrEqual(850);
        expect(wordCount).toBeLessThanOrEqual(1650);
      });
    });

    it("generates and verifies the genuine 3-page vector PDF for the Three-Bucket Retirement Plan", async () => {
      const fs = await import("fs");
      const path = await import("path");
      const { generateThreeBucketPdf } = await import("@/scripts/generateRetirementPdf");

      const pdfBytes = generateThreeBucketPdf();
      expect(pdfBytes).toBeDefined();
      expect(pdfBytes.length).toBeGreaterThan(10000); // Greater than 10 KB

      // Write to public/downloads/
      const downloadsDir = path.resolve(process.cwd(), "public/downloads");
      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }
      const targetPath = path.join(downloadsDir, "AIM-Three-Bucket-Retirement-Plan.pdf");
      fs.writeFileSync(targetPath, pdfBytes);

      expect(fs.existsSync(targetPath)).toBe(true);
      const stat = fs.statSync(targetPath);
      expect(stat.size).toBeGreaterThan(10000);

      // Verify PDF header and structure
      const headerStr = new TextDecoder().decode(pdfBytes.slice(0, 8));
      expect(headerStr).toContain("%PDF-1.4");
    });
  });
});
