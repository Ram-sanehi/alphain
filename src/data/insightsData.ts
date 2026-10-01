export interface Author {
  name: string;
  role?: string;
  credentials?: string;
  avatar?: string;
  bio?: string;
}

export type InsightCategory =
  | "Market Commentary"
  | "Fiduciary Wealth"
  | "Tax Optimization"
  | "Retirement Planning"
  | "Asset Allocation";

export interface ImagePhotoMetadata {
  photographer: string;
  sourceUrl: string;
  license: string;
  hasVisibleFace: boolean;
  altText: string;
}

export type ReviewStatus = "approved by compliance" | "reviewed by author" | "draft";

export interface InsightPost {
  slug: string;
  title: string;
  excerpt: string;
  category: InsightCategory;
  readTime: string;
  publishedDate: string;
  publishedIsoDate?: string;
  lastUpdatedDate?: string;
  lastUpdatedIsoDate?: string;
  reviewStatus?: ReviewStatus;
  complianceApprovalDate?: string;
  author: Author;
  coverImage?: string; // High-resolution curated photo cover
  coverImageSrcSet?: string; // Responsive srcset (640w, 1024w, 1600w)
  imageMetadata?: ImagePhotoMetadata;
  downloadablePdf?: {
    title: string;
    fileSize: string;
    fileName: string;
  };
  content: string[];
  keyTakeaways: string[];
  relatedSlugs: string[];
}

/**
 * Statutory Compliance Disclosure for Fiduciary Perspectives & Market Research
 * Centralized constant for compliance editing.
 */
export const INSIGHTS_COMPLIANCE_DISCLOSURE =
  "Commentary is for educational purposes and is not investment advice or a recommendation. Investments in securities market are subject to market risks. Read all related documents carefully before investing. Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors. SEBI RIA INA000017348.";

/**
 * Dynamically computes estimated reading time based on 200 words per minute.
 * If the full body text exists (at least 300 words), computes ceil(wordCount / 200).
 * If a full body does not exist yet (stub/executive summary under 300 words or missing),
 * falls back to the manual `readTime` field from the article config.
 */
export function computeReadTime(post: InsightPost): string {
  if (post.content && post.content.length > 0) {
    const fullBody = post.content.join(" ").trim();
    const wordCount = fullBody ? fullBody.split(/\s+/).filter(Boolean).length : 0;
    if (wordCount >= 300) {
      const minutes = Math.max(1, Math.ceil(wordCount / 200));
      return `${minutes} min read`;
    }
  }
  return post.readTime || "5 min read";
}

import { INSIGHT_ARTICLES, FullInsightArticle } from "./insightsArticles";
export { INSIGHT_ARTICLES, type FullInsightArticle };

export const INSIGHTS_POSTS: InsightPost[] = [
  {
    slug: "navigating-india-market-volatility-fiduciary-framework",
    title: "Navigating Market Volatility: A Fiduciary Framework for High-Net-Worth Portfolios",
    excerpt: "Why emotional drawdowns harm compounding more than structural corrections, and how institutional asset rebalancing captures asymmetric upside.",
    category: "Market Commentary",
    readTime: "6 min read",
    publishedDate: "September 24, 2026",
    publishedIsoDate: "2026-09-24",
    lastUpdatedDate: "September 28, 2026",
    lastUpdatedIsoDate: "2026-09-28",
    reviewStatus: "approved by compliance",
    complianceApprovalDate: "September 28, 2026",
    author: {
      name: "Nageshwar Prasad",
      role: "Founder & Principal Officer",
      credentials: "SEBI Registered Investment Adviser · INA000017348",
      bio: "Nageshwar leads the investment committee at Alpha Investment Management, specializing in fiduciary capital allocation, institutional risk architecture, and inter-generational family wealth stewardship.",
    },
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    coverImageSrcSet: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=640&q=80 640w, https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1024&q=80 1024w, https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85 1600w",
    imageMetadata: {
      photographer: "Sean Pollock",
      sourceUrl: "https://unsplash.com/photos/PhYq704ffdA",
      license: "Unsplash License (Commercial use permitted)",
      hasVisibleFace: false,
      altText: "Low-angle perspective of contemporary glass skyscrapers reflecting sky, symbolizing structural resilience",
    },
    downloadablePdf: {
      title: "Q3 Fiduciary Market Outlook & Risk Allocation Report",
      fileSize: "1.8 MB",
      fileName: "AIM-Q3-Fiduciary-Market-Outlook.pdf",
    },
    keyTakeaways: [
      "Market drawdowns are the non-negotiable admission price for long-term equity compounding above 12% CAGR.",
      "Fixed asset-allocation rebalancing bands force investors to buy fear systematically without emotional hesitation.",
      "Direct equity and low-cost debt combinations preserve 100-150 bps annually versus regular mutual fund commission structures.",
    ],
    content: [
      "In modern equity markets, headline volatility frequently induces anxiety even among seasoned capital allocators. Yet across seven decades of Indian capital market history, corrections of 10% occur almost annually, while drawdowns exceeding 20% occur once every three to four years.",
      "As a SEBI Registered Investment Adviser, our primary fiduciary mandate is not merely selecting winning assets, but establishing defensive allocation protocols that prevent behavioral liquidation at cyclical bottoms.",
      "When equity valuations run ahead of corporate earnings fundamentals, our quantitative rebalancing triggers automatically trim equities back to target weightings, moving liquidity into sovereign debt or short-duration liquid instruments. When corrections arrive, this dry powder is systematically deployed into high-return-on-equity franchises at depressed valuations.",
      "True wealth preservation is not achieved by attempting to time volatile macro peaks; it is engineered through unyielding discipline, non-custodial structural ownership, and relentless tax optimization.",
    ],
    relatedSlugs: [
      "tax-loss-harvesting-playbook-indian-equities",
      "pure-fee-only-vs-commission-brokers",
    ],
  },
  {
    slug: "tax-loss-harvesting-playbook-indian-equities",
    title: "The Indian Family Office Tax Playbook: Annual Harvesting & Capital Gains Shielding",
    excerpt: "How proactive tax-loss harvesting and Section 54F structuring legally minimize the drag of short-term and long-term capital gains tax.",
    category: "Tax Optimization",
    readTime: "8 min read",
    publishedDate: "September 18, 2026",
    publishedIsoDate: "2026-09-18",
    lastUpdatedDate: "September 26, 2026",
    lastUpdatedIsoDate: "2026-09-26",
    reviewStatus: "approved by compliance",
    complianceApprovalDate: "September 26, 2026",
    author: {
      name: "Adv. Rajat Diwan",
      role: "Chief Compliance Officer & Tax Counsel",
      credentials: "High Court Advocate · SEBI Regulatory Governance",
      bio: "Adv. Rajat Diwan counsels prominent family offices and corporate promoters on statutory governance, capital gains structuring under the Income Tax Act, and inter-generational private trust engineering.",
    },
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85",
    coverImageSrcSet: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=640&q=80 640w, https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1024&q=80 1024w, https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85 1600w",
    imageMetadata: {
      photographer: "Hunters Race",
      sourceUrl: "https://unsplash.com/photos/MYbhN8KaaEc",
      license: "Unsplash License (Commercial use permitted)",
      hasVisibleFace: false, // Cropped below chin; anonymous suit attire strictly complying with SEBI endorsement code
      altText: "Tailored suit jacket being buttoned by an executive, symbolizing meticulous portfolio structuring",
    },
    downloadablePdf: {
      title: "FY 2025-26 Indian Capital Gains Tax Optimization Whitepaper",
      fileSize: "2.4 MB",
      fileName: "AIM-Tax-Loss-Harvesting-Whitepaper.pdf",
    },
    keyTakeaways: [
      "Harvesting unrealized short-term equity losses against realized gains legally offsets tax liabilities with zero net risk change.",
      "Grandfathered capital gains provisions and Section 112A annual ₹1.25 Lakh exemptions must be cycled annually.",
      "Private family trust structuring ringfences estates from potential inheritance tax legislation while consolidating inter-generational wealth.",
    ],
    content: [
      "Taxes are the single largest guaranteed friction on compounded capital growth. A portfolio generating 14% gross returns can easily deteriorate into 10.5% net post-tax returns if capital gains are realized indiscriminately.",
      "Through systematic tax-loss harvesting, our advisory team monitors portfolio positions throughout the fiscal fourth quarter. Underperforming holdings with short-term paper losses are liquidated to offset realized short-term and long-term gains, followed by immediate reinvestment into equivalent asset classes.",
      "Furthermore, for families managing substantial liquidity events from real estate dispositions or startup ESOP buybacks, integrating Section 54EC capital gains bonds with statutory holding structures preserves capital integrity without unnecessary punitive leakage.",
    ],
    relatedSlugs: [
      "navigating-india-market-volatility-fiduciary-framework",
      "perpetual-swp-retirement-drawdown-blueprint",
    ],
  },
  {
    slug: "pure-fee-only-vs-commission-brokers",
    title: "The Unseen Cost: Why Pure Fee-Only Fiduciary Advice Outperforms Commissioned Brokers",
    excerpt: "A transparent breakdown of trail commissions, hidden mutual fund expense ratios, and why the SEBI RIA framework protects investor capital.",
    category: "Fiduciary Wealth",
    readTime: "5 min read",
    publishedDate: "September 10, 2026",
    publishedIsoDate: "2026-09-10",
    lastUpdatedDate: "September 25, 2026",
    lastUpdatedIsoDate: "2026-09-25",
    reviewStatus: "approved by compliance",
    complianceApprovalDate: "September 25, 2026",
    author: {
      name: "Nageshwar Prasad",
      role: "Founder & Principal Officer",
      credentials: "SEBI Registered Investment Adviser · INA000017348",
      bio: "Nageshwar has spent over two decades advocating for investor protection and fiduciary alignment in Indian financial services, authoring analytical treatises on intermediary incentives.",
    },
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=85",
    coverImageSrcSet: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=640&q=80 640w, https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1024&q=80 1024w, https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=85 1600w",
    imageMetadata: {
      photographer: "Tingey Injury Law Firm",
      sourceUrl: "https://unsplash.com/photos/nSpj-Z12lX0",
      license: "Unsplash License (Commercial use permitted)",
      hasVisibleFace: false, // Classical bronze balance scales, zero human face
      altText: "Classical bronze scales of justice in equilibrium, symbolizing fiduciary integrity and conflict-free alignment",
    },
    downloadablePdf: {
      title: "The True Cost of Distributor Commissions in Indian Wealth Management",
      fileSize: "1.2 MB",
      fileName: "AIM-Fee-Only-Fiduciary-Guide.pdf",
    },
    keyTakeaways: [
      "Regular mutual funds deduct between 0.75% to 1.50% every year from your total corpus to pay distributor commissions.",
      "Over a 20-year horizon on a ₹1 Crore portfolio, switching to direct plans saves over ₹78 Lakhs in compounding leakage.",
      "SEBI RIA regulations mandate pure fiduciary duty — meaning 0% third-party incentives and 100% legal alignment with the client.",
    ],
    content: [
      "Most Indian investors believe their wealth advisor or bank relationship manager provides 'free' service. In reality, regular mutual fund schemes deduct up to 1.5% in ongoing distributor commissions straight from your fund NAV every single year, regardless of whether your portfolio makes or loses money.",
      "On a ₹2 Crore portfolio compounding at 12% over 25 years, that 1% fee difference compounds to a staggering ₹3.4 Crores lost to distributor intermediaries.",
      "Under the SEBI (Investment Advisers) Regulations, 2013, independent RIAs like Alpha Investment Management charge a direct, transparent fee and are strictly prohibited from receiving distributor commissions. Your capital stays 100% invested in Direct plans and institutional securities.",
    ],
    relatedSlugs: [
      "navigating-india-market-volatility-fiduciary-framework",
      "perpetual-swp-retirement-drawdown-blueprint",
    ],
  },
  {
    slug: "perpetual-swp-retirement-drawdown-blueprint",
    title: "The Perpetual SWP Blueprint: Engineering Retirement Income in an Era of 6% Inflation",
    excerpt: "How modern retirees combine high-grade arbitrage, short-duration debt, and dividend equity buckets to generate perpetual monthly cash flow.",
    category: "Retirement Planning",
    readTime: "7 min read",
    publishedDate: "August 28, 2026",
    publishedIsoDate: "2026-08-28",
    lastUpdatedDate: "September 27, 2026",
    lastUpdatedIsoDate: "2026-09-27",
    reviewStatus: "approved by compliance",
    complianceApprovalDate: "September 27, 2026",
    author: {
      name: "Senior Advisory Committee",
      role: "Alpha Investment Management",
      credentials: "Fiduciary Wealth Mandate · Pune",
      bio: "The Senior Advisory Committee at Alpha Investment Management comprises seasoned actuaries, chartered accountants, and fiduciary investment advisers managing multi-generational retirement mandates.",
    },
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85",
    coverImageSrcSet: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=640&q=80 640w, https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1024&q=80 1024w, https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85 1600w",
    imageMetadata: {
      photographer: "Bailey Zindel",
      sourceUrl: "https://unsplash.com/photos/NRQV-hBF10M",
      license: "Unsplash License (Commercial use permitted)",
      hasVisibleFace: false, // Natural alpine lake landscape, zero human face
      altText: "Peaceful mountain river valley with still waters reflecting morning light, symbolizing retirement peace of mind",
    },
    downloadablePdf: {
      title: "The Three-Bucket Retirement Architecture (SWP Guide)",
      fileSize: "2.1 MB",
      fileName: "AIM-Three-Bucket-Retirement-Plan.pdf",
    },
    keyTakeaways: [
      "Relying entirely on fixed bank deposits exposes retirees to negative real returns after accounting for 6% inflation and 30% tax brackets.",
      "The Three-Bucket Strategy partitions capital into Immediate Cash (Years 1-3), Conservative Yield (Years 4-7), and Growth Compounding (Years 8+).",
      "Systematic Withdrawal Plans (SWP) in equity and hybrid funds offer extreme tax efficiency compared to traditional annuity or FD interest.",
    ],
    content: [
      "Retirement is no longer a static 10-year span; with rising Indian longevity, a retiree at 58 must comfortably fund 25 to 30 years of lifestyle expenditure.",
      "If your monthly household expense is ₹1,00,000 today, a 6% annual inflation rate means you will require ₹3,20,000 per month twenty years from now just to preserve your standard of living.",
      "Our Three-Bucket Architecture segregates retirement assets: Bucket 1 holds 36 months of living expenses in liquid debt funds for absolute peace of mind; Bucket 2 holds conservative hybrid assets generating replenishing yields; and Bucket 3 compounds in diversified equity indices to continuously beat inflation.",
    ],
    relatedSlugs: [
      "pure-fee-only-vs-commission-brokers",
      "tax-loss-harvesting-playbook-indian-equities",
    ],
  },
  {
    slug: "strategic-asset-allocation-high-net-worth",
    title: "Strategic Asset Allocation: The Mathematical Bedrock of High-Net-Worth Portfolios",
    excerpt: "Why 90% of long-term portfolio return variability is determined by asset class distribution rather than security selection or market timing.",
    category: "Asset Allocation",
    readTime: "6 min read",
    publishedDate: "August 15, 2026",
    publishedIsoDate: "2026-08-15",
    lastUpdatedDate: "September 24, 2026",
    lastUpdatedIsoDate: "2026-09-24",
    reviewStatus: "approved by compliance",
    complianceApprovalDate: "September 24, 2026",
    author: {
      name: "Senior Advisory Committee",
      role: "Alpha Investment Management",
      credentials: "Quantitative Allocation Mandate",
      bio: "The Senior Advisory Committee at Alpha Investment Management manages quantitative multi-asset mandates, combining econometric risk models with strict fiduciary stewardship for Indian family offices.",
    },
    coverImage: "/images/insights/asset-allocation.jpg",
    coverImageSrcSet: "/images/insights/asset-allocation-640w.webp 640w, /images/insights/asset-allocation-1024w.webp 1024w, /images/insights/asset-allocation-1600w.webp 1600w",
    imageMetadata: {
      photographer: "Alex Azabache",
      sourceUrl: "https://unsplash.com/photos/aerial-photography-of-city-buildings-VviFtDJakYk",
      license: "Unsplash License (Commercial use permitted)",
      hasVisibleFace: false, // Geometric high-altitude city blocks, zero human face
      altText: "High-altitude aerial view of an organized metropolitan financial district street grid and geometric glass-and-steel skyscrapers, representing multi-asset allocation geometry",
    },
    downloadablePdf: {
      title: "The Mathematical Foundations of Asset Allocation",
      fileSize: "1.9 MB",
      fileName: "AIM-Strategic-Asset-Allocation.pdf",
    },
    keyTakeaways: [
      "Empirical research demonstrates that asset allocation policy explains over 90% of long-term investment return variability.",
      "Rebalancing between non-correlated asset classes provides a structural volatility dampener while locking in gains.",
      "Sovereign fixed income anchors principal security, allowing equities to compound unhindered through business cycles.",
    ],
    content: [
      "In the pursuit of alpha, many investors expend disproportionate energy on stock picking and tactical market timing. Yet rigorous financial econometrics consistently reveals that long-term portfolio variance is overwhelmingly driven by high-level asset allocation.",
      "A portfolio engineered across non-correlated asset classes—large-cap compounding equities, AAA sovereign bonds, gold hedges, and liquidity buffers—delivers superior risk-adjusted Sharpe ratios compared to concentrated speculative holdings.",
      "At Alpha Investment Management, our asset allocation framework establishes dynamic tolerance bands. Rather than reacting to emotional market narratives, capital is reallocated objectively based on valuation spreads and macro yield curves.",
    ],
    relatedSlugs: [
      "navigating-india-market-volatility-fiduciary-framework",
      "perpetual-swp-retirement-drawdown-blueprint",
    ],
  },
];
