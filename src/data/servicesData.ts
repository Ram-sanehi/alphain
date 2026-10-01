export interface ServiceStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  teaserTag: string;
  shortDesc: string;
  fullDesc: string;
  heroImage: string;
  hoverImage: string;
  keyBenefits: string[];
  process: ServiceStep[];
  faqs: ServiceFAQ[];
  assetClasses?: string[];
  offerings?: string[];
}

export const servicesData: ServiceItem[] = [
  {
    id: "investment-management",
    slug: "investment-management",
    number: "01",
    title: "Investment Management",
    teaserTag: "Portfolio Strategy",
    shortDesc: "Data-driven equity and liquid debt strategies engineered for capital preservation and compounding.",
    fullDesc: "Our fee-only investment advisory service operates under strict SEBI fiduciary mandates. We construct high-conviction, custom portfolios tailored to your liquidity needs, multi-year compounding targets, and volatility tolerance — with zero distributor commissions.",
    heroImage: "/images/services/service-01-investment-management.jpg",
    hoverImage: "/images/services/service-01-investment-management.webp",
    keyBenefits: [
      "Quantitative portfolio construction balancing downside protection and compounding",
      "Direct ownership in high-conviction Indian equities, mutual funds & liquid debt",
      "Systematic rebalancing with disciplined profit harvesting across market cycles",
      "Absolute zero distributor kickbacks — 100% fiduciary alignment with your family",
      "Direct access to Chief Investment Officer with bi-weekly analytical research letters"
    ],
    process: [
      {
        step: 1,
        title: "Risk Profiling & Capital Mapping",
        description: "Comprehensive diagnosis of your family's liquidity horizons, tax brackets, past draw-down experiences, and required return thresholds."
      },
      {
        step: 2,
        title: "Asset Allocation Architecture",
        description: "Formulating bespoke strategic weights across large-cap leaders, mid-market compounders, sovereign debt duration, and emergency liquidity."
      },
      {
        step: 3,
        title: "High-Conviction Security Selection",
        description: "Rigorous quantitative and fundamental screening identifying capital-efficient businesses with robust balance sheets and ethical management."
      },
      {
        step: 4,
        title: "Institutional Execution & Phased Entry",
        description: "Executing trades directly in your own Demat account using tranche deployment to reduce market timing risk and transaction drag."
      },
      {
        step: 5,
        title: "Continuous Surveillance & Rebalancing",
        description: "Continuous portfolio tracking against macroeconomic shifts with disciplined quarterly rebalancing to lock in gains and protect capital."
      }
    ],
    faqs: [
      {
        question: "How does fee-only advisory differ from mutual fund distributors?",
        answer: "Distributors earn ongoing hidden commissions (0.5%–1.5% annually) from fund houses based on the products they sell to you. As SEBI Registered Investment Advisors, we accept zero commissions from financial institutions. We charge a transparent, direct advisory fee, ensuring our recommendations are 100% aligned with your capital growth."
      },
      {
        question: "Do you hold custody of client funds or securities?",
        answer: "No. Your funds and securities remain securely in your own Demat and bank accounts with Tier-1 depositories (NSDL/CDSL). We operate purely on advisory mandates with zero custody risk."
      },
      {
        question: "What is the minimum recommended portfolio size for investment management?",
        answer: "Our bespoke investment management services are ideal for portfolios starting at ₹25 Lakhs, allowing adequate multi-sector diversification and direct securities exposure."
      },
      {
        question: "How frequently will my portfolio be reviewed?",
        answer: "We monitor allocations continuously, issue formal monthly performance teardowns, and hold dedicated quarterly review meetings to rebalance weights."
      }
    ],
    assetClasses: [
      "Large & Mid-Cap Equities",
      "Short & Long Duration Debt",
      "Direct Mutual Funds",
      "Sovereign Gold Bonds",
      "Treasury Bills & Arbitrage Funds"
    ]
  },
  {
    id: "financial-planning",
    slug: "financial-planning",
    number: "02",
    title: "Financial Planning",
    teaserTag: "Wealth Architecture",
    shortDesc: "Holistic architecture aligning family cash flows, risk boundaries, and multi-decade wealth aspirations.",
    fullDesc: "A complete master blueprint coordinating all assets, liabilities, insurance policies, and family milestones into one synchronized, stress-tested path toward absolute financial sovereignty.",
    heroImage: "/images/services/service-02-financial-planning.jpg",
    hoverImage: "/images/services/service-02-financial-planning.webp",
    keyBenefits: [
      "360-degree audit and consolidation of scattered family assets, bank accounts, and loans",
      "Goal-specific liability matching for children's overseas education and major life transitions",
      "Stress-tested emergency liquidity buffers protecting investments during sudden downturns",
      "Consolidated family net-worth dashboard and annual financial health scorecards",
      "Elimination of emotional decision-making through an analytical financial playbook"
    ],
    process: [
      {
        step: 1,
        title: "Discovery & Cash Flow Diagnosis",
        description: "Detailed inventory of current assets, liabilities, insurances, cash outflows, and net annual investable surplus."
      },
      {
        step: 2,
        title: "Goal Quantification & Prioritization",
        description: "Mapping family aspirations (education, property, sabbatical, retirement) against inflation models and precise timelines."
      },
      {
        step: 3,
        title: "Scenario Modeling & Stress Testing",
        description: "Simulating market crashes, unexpected medical events, and career changes to stress-test your family's solvency."
      },
      {
        step: 4,
        title: "Strategic Master Plan Delivery",
        description: "Delivering an actionable 25+ page diagnostic report with exact monthly allocations and contingency protocols."
      },
      {
        step: 5,
        title: "Annual Calibration & Life Stage Pivots",
        description: "Yearly review to adjust the roadmap for salary hikes, new family members, business ventures, or revised priorities."
      }
    ],
    faqs: [
      {
        question: "What deliverables do I receive from a financial plan?",
        answer: "You receive an exhaustive diagnostic report detailing net worth statements, cash flow projections, goal-funding timelines, insurance adequacy audits, and explicit step-by-step action plans."
      },
      {
        question: "Can you help consolidate fragmented investments across multiple family members?",
        answer: "Yes. We specialize in family-level consolidation, bringing scattered fixed deposits, mutual funds, EPF/PPF, and insurance policies into a unified governance framework."
      },
      {
        question: "How long does the financial planning process take?",
        answer: "Typically 2 to 3 weeks from initial data discovery to final roadmap presentation, with interactive workshops in between."
      }
    ],
    assetClasses: [
      "Family Cash Flow Structuring",
      "Education Endowment Planning",
      "Contingency Reserve Funds",
      "Real Estate Rationalization",
      "Legacy Continuity"
    ]
  },
  {
    id: "loan-services",
    slug: "loan-services",
    number: "03",
    title: "Loan Services",
    teaserTag: "Institutional Credit",
    shortDesc: "Institutional credit syndication and bespoke leverage structures for prime property and business expansion.",
    fullDesc: "Direct access to Tier-1 banking partners and competitive credit spreads. We evaluate debt capacity, negotiate competitive interest rates, and handle complex underwriting documentation for high-ticket loans.",
    heroImage: "/images/services/service-03-loan-services.jpg",
    hoverImage: "/images/services/service-03-loan-services.webp",
    keyBenefits: [
      "Preferred institutional lending rates with top private and nationalized banks",
      "Comprehensive balance transfer solutions saving lakhs in cumulative interest",
      "Loan Against Property (LAP) to unlock capital without liquidating equity portfolios",
      "End-to-end documentation handling, legal title diligence, and property valuation",
      "Zero hidden fee markups and transparent appraisal support"
    ],
    process: [
      {
        step: 1,
        title: "Borrowing Capacity & Balance Sheet Audit",
        description: "Analyzing income streams, existing EMI obligations, and collateral valuation to identify optimal borrowing limits."
      },
      {
        step: 2,
        title: "Multi-Lender Rate Bidding",
        description: "Sourcing and negotiating competitive spreads across 15+ partner banks and Tier-1 housing finance institutions."
      },
      {
        step: 3,
        title: "Dossier Preparation & Underwriting",
        description: "Structuring clean financial statements, ITRs, and title documents to accelerate credit committee approval."
      },
      {
        step: 4,
        title: "Sanction Letter Scrutiny",
        description: "Reviewing terms to eliminate prepayment penalties, onerous covenants, and hidden processing charges."
      },
      {
        step: 5,
        title: "Disbursement & Amortization Management",
        description: "Ensuring smooth escrow disbursement and designing structured prepayments to eliminate debt ahead of schedule."
      }
    ],
    faqs: [
      {
        question: "Which banks and lending partners does Alpha work with?",
        answer: "We partner with leading institutions including HDFC Bank, ICICI Bank, State Bank of India, Axis Bank, Bank of Baroda, and premier housing finance companies."
      },
      {
        question: "Can I transfer my existing home loan to a lower interest rate?",
        answer: "Yes. We execute seamless home loan balance transfers to current repo-linked benchmark rates, often shaving 50–100 bps off your current interest rate."
      },
      {
        question: "What types of collateral can be used for Loan Against Property (LAP)?",
        answer: "Clear-title residential, commercial, or industrial properties can be mortgaged to unlock long-term liquidity at attractive borrowing costs."
      }
    ],
    assetClasses: [
      "Prime Residential Home Loans",
      "Loan Against Property (LAP)",
      "Commercial Real Estate Purchase",
      "Balance Transfer & Top-Up",
      "Business Working Capital Credit"
    ]
  },
  {
    id: "insurance-risk-management",
    slug: "insurance-risk-management",
    number: "04",
    title: "Insurance & Risk Management",
    teaserTag: "Asset Protection & Hedging",
    shortDesc: "Actuarial risk modeling and high-value indemnity structures to insulate capital against catastrophic liabilities.",
    fullDesc: "Proactive risk transfer frameworks designed to ring-fence your accumulated balance sheet. We audit existing policies for structural gaps, recommend optimal pure-risk coverage, and manage high-stakes claim advocacy without commission biases.",
    heroImage: "/images/services/service-04-insurance-risk.jpg",
    hoverImage: "/images/services/service-04-insurance-risk.webp",
    keyBenefits: [
      "Actuarial mortality and morbidity analysis to calculate precise pure-risk requirements",
      "Diagnostic audit of legacy ULIPs, endowment policies, and high-deductible health plans",
      "Pure term life structuring under Married Women's Property Act (MWPA) for debt immunity",
      "Super top-up healthcare syndication with zero room-rent caps and restore benefits",
      "Dedicated claims advocacy and concierge support during hospitalization and settlements"
    ],
    process: [
      {
        step: 1,
        title: "Diagnostic Audit & Policy Scrutiny",
        description: "Evaluating existing legacy life, health, and commercial policies to uncover exclusions, co-pays, and sub-limits."
      },
      {
        step: 2,
        title: "Human Life Value (HLV) Computation",
        description: "Calculating exact economic replacement value and family liability exposure using actuarial principles."
      },
      {
        step: 3,
        title: "Pure Risk Product Architecture",
        description: "Selecting high-claim-settlement ratio underwriters with transparent terms, zero hidden deductibles, and low premiums."
      },
      {
        step: 4,
        title: "Statutory Ring-Fencing & MWPA Integration",
        description: "Structuring policies under the Married Women's Property Act so death proceeds cannot be attached by business creditors or courts."
      },
      {
        step: 5,
        title: "Periodic Stress-Testing & Claim Concierge",
        description: "Annual coverage recalibration as family net worth grows, alongside 24/7 dedicated claim settlement representation."
      }
    ],
    faqs: [
      {
        question: "Why do you advocate pure term insurance over endowment or ULIP policies?",
        answer: "Endowment and ULIP plans combine poor investment returns (typically 4%–6%) with inadequate insurance coverage. By separating investment (via equity/debt mutual funds) from insurance (via low-cost pure term plans), you achieve 10x higher coverage while building significantly greater wealth."
      },
      {
        question: "What is the Married Women's Property Act (MWPA) protection?",
        answer: "A term policy endorsed under Section 6 of the MWPA forms a private statutory trust for the exclusive benefit of your wife and/or children. The policy proceeds cannot be attached by creditors, tax authorities, or court injunctions."
      },
      {
        question: "Can you assist with claim settlements for existing policies not purchased through Alpha?",
        answer: "Yes. Our fiduciary advisory mandates include claims litigation support and documentation assistance for all existing family insurance contracts."
      }
    ],
    assetClasses: [
      "High-Sum Pure Term Life (MWPA)",
      "Comprehensive Super Top-Up Health",
      "Critical Illness & Trauma Riders",
      "Director & Officers (D&O) Liability",
      "Keyman & Corporate Asset Insurance",
      "Commercial Property & Fire Indemnity"
    ]
  },
  {
    id: "tax-planning",
    slug: "tax-planning",
    number: "05",
    title: "Tax Planning",
    teaserTag: "Capital Gains & Structuring",
    shortDesc: "Disciplined fiscal structuring and capital gains optimization designed to maximize net compounding.",
    fullDesc: "Strategic fiscal optimization ensuring your capital compounds at peak post-tax efficiency. We leverage statutory deductions, tax-loss harvesting, and entity structuring in full compliance with Indian tax statutes.",
    heroImage: "/images/services/service-05-tax-planning.jpg",
    hoverImage: "/images/services/service-05-tax-planning.webp",
    keyBenefits: [
      "Strategic utilization of Sections 80C, 80D, 24, and 54F exemptions",
      "Proactive capital gains tax harvesting on long-term equity portfolios before March 31",
      "Optimal tax entity advisory for professionals, corporate executives, and business owners",
      "Private family trust taxation insulation to safeguard multi-generational wealth",
      "Audit-proof documentation and advance tax liability projections"
    ],
    process: [
      {
        step: 1,
        title: "Income Dissection & Tax Bracket Audit",
        description: "Detailed breakdown of professional income, dividend distributions, capital gains, and business cash flows."
      },
      {
        step: 2,
        title: "Deduction & Exemption Mapping",
        description: "Exhaustive evaluation of underutilized deductions under both old and new Indian tax regimes."
      },
      {
        step: 3,
        title: "Tax-Loss Harvesting Strategy",
        description: "Timing the realization of capital losses against equity gains to legitimately minimize annual capital gains tax."
      },
      {
        step: 4,
        title: "Holding Structure & Entity Optimization",
        description: "Structuring corporate holdings, LLPs, or private family trusts to insulate future generational income."
      },
      {
        step: 5,
        title: "Compliance & Filing Reconciliation",
        description: "Quarterly advance tax calculations and seamless annual income tax reconciliation to prevent statutory penalties."
      }
    ],
    faqs: [
      {
        question: "What is the difference between tax planning and tax evasion?",
        answer: "Tax planning is the legitimate, lawful arrangement of your financial affairs to take full advantage of statutory deductions, exemptions, and reliefs provided by the Income Tax Act. We strictly practice transparent, audit-ready compliance."
      },
      {
        question: "How does tax-loss harvesting work in equity portfolios?",
        answer: "Before the fiscal year ends, we strategically realize short-term or long-term capital losses on underperforming securities to offset realized taxable gains, immediately reinvesting in equivalent securities."
      },
      {
        question: "Do you advise on taxation for NRI clients?",
        answer: "Yes. We advise on Double Taxation Avoidance Agreements (DTAA), TDS on property sales under Section 195, and repatriation compliance."
      }
    ],
    assetClasses: [
      "Section 80C & 80D Deductions",
      "Section 54/54EC Capital Gains Relief",
      "Tax-Loss Harvesting",
      "Private Trust Taxation",
      "Corporate Dividend Optimization"
    ]
  },
  {
    id: "retirement-planning",
    slug: "retirement-planning",
    number: "06",
    title: "Retirement Planning",
    teaserTag: "Decumulation & Legacy",
    shortDesc: "Sustainable decumulation frameworks and estate preservation ensuring lifelong financial sovereignty.",
    fullDesc: "Engineered decumulation strategies designed to ensure you never outlive your wealth. We build inflation-resistant income streams, ring-fence healthcare expenses, and construct seamless estate transition frameworks.",
    heroImage: "/images/services/service-06-retirement-planning.jpg",
    hoverImage: "/images/services/service-06-retirement-planning.webp",
    keyBenefits: [
      "Actuarial corpus calculation accounting for healthcare inflation and longevity",
      "Tax-efficient Systematic Withdrawal Plans (SWP) delivering steady monthly liquidity",
      "Multi-bucket portfolio strategy separating short-term spending from long-term compounding",
      "Ring-fenced medical contingency reserves preventing corpus erosion in later years",
      "Estate planning integration with registered wills and private family trusts"
    ],
    process: [
      {
        step: 1,
        title: "Lifestyle & Post-Retirement Expense Modeling",
        description: "Projecting expected monthly expenditures, travel aspirations, medical needs, and desired lifestyle parameters."
      },
      {
        step: 2,
        title: "Inflation-Adjusted Corpus Computation",
        description: "Using Monte Carlo probability simulations to determine the exact nest egg required to sustain 30+ years of retirement."
      },
      {
        step: 3,
        title: "Three-Bucket Allocation Architecture",
        description: "Segmenting assets into Bucket 1 (1–3 years cash), Bucket 2 (3–7 years debt income), and Bucket 3 (7+ years compounding equities)."
      },
      {
        step: 4,
        title: "Tax-Optimized SWP Deployment",
        description: "Setting up automated, tax-advantaged monthly cash withdrawals directly into your bank account."
      },
      {
        step: 5,
        title: "Estate Transition & Legacy Preservation",
        description: "Drafting registered wills, structuring private trusts, and assigning clear nominations to avoid probate delays."
      }
    ],
    faqs: [
      {
        question: "How is an SWP more tax-efficient than conventional Fixed Deposit interest?",
        answer: "Bank Fixed Deposit interest is taxed at your highest income slab rate (up to 30%+ surcharge). In contrast, with a Systematic Withdrawal Plan (SWP) from debt or equity mutual funds, only the capital gains fraction of each withdrawal is taxed, drastically reducing your annual tax burden."
      },
      {
        question: "How do you protect retirement portfolios from medical inflation?",
        answer: "Medical inflation in India typically runs at 10%–14%. We structure comprehensive super top-up health policies, allocate dedicated liquid emergency reserves, and maintain an equity growth bucket to outpace medical inflation."
      },
      {
        question: "When is the ideal time to start planning for retirement?",
        answer: "While starting in your 30s provides the most powerful compounding runway, our tactical restructuring and asset consolidation create tremendous value even if you are just 3 to 5 years away from retiring."
      }
    ],
    assetClasses: [
      "Systematic Withdrawal Plans (SWP)",
      "Senior Citizen Savings Schemes (SCSS)",
      "National Pension System (NPS)",
      "High-Yield Sovereign Debt",
      "Estate & Private Family Trusts"
    ]
  }
];
