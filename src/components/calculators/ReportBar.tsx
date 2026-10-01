import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareMenuPopover } from "./ShareMenuPopover";
import { CalculatorStatePayload } from "@/utils/calculatorUrlParams";

interface ReportBarProps {
  state: CalculatorStatePayload;
  shareUrl: string;
  onGeneratePdf: (state: CalculatorStatePayload) => Promise<{ blob: Blob; filename: string }>;
}

export function ReportBar({ state, shareUrl, onGeneratePdf }: ReportBarProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string>("Alpha-Investment-Report.pdf");

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await onGeneratePdf(state);
      setPdfBlob(result.blob);
      setPdfFilename(result.filename);

      // Trigger download
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      setErrorMessage("Couldn't generate the report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
        {/* 1. Download Report (Primary Gold) */}
        <Button
          type="button"
          onClick={handleDownload}
          disabled={loading}
          className="h-[44px] px-6 rounded-xl bg-[#C9A96E] hover:bg-[#d6af57] text-[#070B14] text-xs font-sans font-semibold transition-all duration-200 shadow-md hover:shadow-[#C9A96E]/20 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B14] disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#070B14]" />
              <span>Preparing report…</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#070B14]" />
              <span>Download Report</span>
            </>
          )}
        </Button>

        {/* 2. Share This Calculation (Secondary Outline via ShareMenuPopover) */}
        <ShareMenuPopover
          shareUrl={shareUrl}
          pdfBlob={pdfBlob}
          pdfFilename={pdfFilename}
        />
      </div>

      {/* Error state announcement */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="text-xs font-sans text-rose-400 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}
