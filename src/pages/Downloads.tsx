import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { StockTicker } from "@/components/StockTicker";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import downloadsData from "@/data/downloadsManifest.json";
import {
  FileText,
  Download,
  ShieldCheck,
  ExternalLink,
  Lock,
  UserCheck,
  Scale,
  FileCheck2,
  Building2,
  AlertCircle,
  Loader2
} from "lucide-react";

export interface DownloadItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  version: string;
  effectiveDate: string;
  reviewStatus: string;
  cleanFileName: string;
  filePath: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  pageCount: number;
  hasExtractableText: boolean;
  hasRupeeSymbol: boolean;
  firstBytes: string;
}

export default function Downloads() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    doc: DownloadItem
  ) => {
    // If the user used modifier keys (cmd/ctrl click to open in tab), let browser handle it
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    setDownloadingId(doc.id);

    try {
      // Validate PDF via HEAD request before download
      const response = await fetch(doc.filePath, { method: "HEAD" });
      const contentType = response.headers.get("content-type") || "";

      // Ensure response is not a 404 error or SPA index.html fallback
      if (!response.ok || contentType.includes("text/html")) {
        toast.error(`Download failed: ${doc.cleanFileName} is missing or returned invalid content.`);
        setDownloadingId(null);
        return;
      }

      // Valid PDF confirmed — trigger direct download
      const link = document.createElement("a");
      link.href = doc.filePath;
      link.download = doc.cleanFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloaded ${doc.cleanFileName} (${doc.fileSizeFormatted})`);
    } catch (err) {
      // Fallback in case HEAD request is blocked by local CORS policy
      const link = document.createElement("a");
      link.href = doc.filePath;
      link.download = doc.cleanFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.info(`Download initiated for ${doc.cleanFileName}`);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F5F1E8] flex flex-col selection:bg-[#C9A24B]/30 selection:text-[#F5F1E8] overflow-x-hidden">
      <Navbar />
      <StockTicker />

      <main className="flex-1">
        {/* Header */}
        <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 border-b border-white/[0.08] overflow-hidden">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-3xl space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A24B]/10 border border-[#C9A24B]/20 text-[10px] font-mono uppercase tracking-[0.25em] text-[#C9A24B]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Statutory Governance &amp; Forms Center</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F5F1E8] leading-[1.12]">
                Client portal &amp; <br />
                <span className="italic text-[#C9A24B]">regulatory downloads.</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base font-sans font-light max-w-2xl leading-relaxed">
                Access official onboarding documents, SEBI-mandated risk profiling forms, fee-only advisory contracts, and login directly to your portfolio reporting dashboard.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CLIENT REPORTING PORTAL LOGIN BANNER */}
        <section className="py-12 border-b border-white/[0.06]">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl">
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#090E1C] via-[#090E1C] to-[#C9A24B]/10 border border-[#C9A24B]/30 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-Bit SSL Encrypted Client Gateway</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8] font-normal">
                  Alpha AIM Client Reporting Portal
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-sans font-light leading-relaxed">
                  Existing private wealth clients can review consolidated daily capital valuations, IRR performance vs Nifty 50 benchmarks, and capital gains tax statements.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
                <Button
                  asChild
                  className="bg-[#C9A24B] hover:bg-[#d6af57] text-[#070B14] font-semibold text-xs uppercase tracking-wider px-8 py-6 rounded-xl transition-all shadow-xl hover:shadow-[#C9A24B]/20 flex items-center justify-center gap-2"
                >
                  <a
                    href="https://reporting.alphaaim.in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Launch Client Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* STATUTORY DOWNLOADS GRID */}
        <section className="py-14 sm:py-20">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl space-y-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C9A24B]">
                Official Forms &amp; Disclosures
              </span>
              <span className="text-xs font-mono text-slate-500">
                SEBI Registration: INA000017348
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(downloadsData as DownloadItem[]).map((doc) => (
                <div
                  key={doc.id}
                  className="p-6 sm:p-7 rounded-3xl bg-[#090E1C] border border-white/[0.08] hover:border-[#C9A24B]/40 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-lg group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-white/[0.04] text-[#C9A24B] border border-white/[0.06]">
                        {doc.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 lining-nums">{doc.version}</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-lg text-[#F5F1E8] font-normal leading-snug group-hover:text-[#C9A24B] transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-slate-300 font-sans font-light leading-relaxed">
                        {doc.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.05] lining-nums">
                        {doc.pageCount} {doc.pageCount === 1 ? "page" : "pages"}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.05] lining-nums">
                        {doc.fileSizeFormatted}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400/90 border border-emerald-500/20">
                        Vector PDF (₹)
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400 lining-nums">
                      PDF · {doc.fileSizeFormatted}
                    </span>
                    <a
                      href={doc.filePath}
                      download={doc.cleanFileName}
                      onClick={(e) => handleDownloadClick(e, doc)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#C9A24B] hover:text-[#d6af57] font-mono font-medium transition-colors cursor-pointer group/link"
                      aria-label={`Download ${doc.cleanFileName}`}
                    >
                      {downloadingId === doc.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Validating...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 transition-transform group-hover/link:-translate-y-0.5" />
                          <span>Download</span>
                        </>
                      )}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* SEBI Compliance Footnote */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 font-sans font-light leading-relaxed">
                All client onboarding forms comply strictly with the SEBI (Investment Advisers) Regulations, 2013 and BASL procedural circulars. Physical copies can also be countersigned at our Pune advisory desk located at Mahalungeker Complex, Chakan.
              </p>
            </div>
          </div>
        </section>

        <CTA
          pill="INSIGHTS & RESOURCES"
          headlineLead="Ready to turn insight into"
          headlineEmphasis="a plan?"
          subtitle="Reading helps, but a plan built around your own finances helps more. Speak with an adviser about your situation."
          buttonLabel="Book a Consultation"
        />
      </main>

      <Footer />
    </div>
  );
}
