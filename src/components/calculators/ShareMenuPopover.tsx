import React, { useState, useEffect } from "react";
import { Copy, Check, Share2, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
} from "@/components/ui/drawer";

interface ShareMenuPopoverProps {
  shareUrl: string;
  pdfBlob?: Blob | null;
  pdfFilename?: string;
}

export function ShareMenuPopover({
  shareUrl,
  pdfBlob,
  pdfFilename = "Alpha-Investment-Report.pdf",
}: ShareMenuPopoverProps) {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const messageText = `My calculation from Alpha Investment Management: ${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleEmail = () => {
    const mailto = `mailto:?subject=${encodeURIComponent(
      "Alpha Investment Management Calculation"
    )}&body=${encodeURIComponent(messageText)}`;
    window.location.href = mailto;
  };

  const hasNativeShare = typeof navigator !== "undefined" && Boolean(navigator.share);

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      if (pdfBlob && navigator.canShare) {
        const file = new File([pdfBlob], pdfFilename, { type: "application/pdf" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Alpha Investment Management",
            text: messageText,
            files: [file],
          });
          return;
        }
      }
      await navigator.share({
        title: "Alpha Investment Management",
        text: messageText,
        url: shareUrl,
      });
    } catch {
      // user cancelled or share failed
    }
  };

  const shareItems = (
    <div className="space-y-1.5 p-1">
      {/* 1. Copy link */}
      <button
        type="button"
        onClick={handleCopy}
        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-sans text-[#F5F1E8] hover:bg-white/[0.06] hover:text-[#C9A96E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
      >
        <span className="flex items-center gap-2.5">
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4 text-[#A8B0BD]" />
          )}
          <span>{copied ? "Link copied" : "Copy link"}</span>
        </span>
        <span className="sr-only" aria-live="polite">
          {copied ? "Link copied" : ""}
        </span>
      </button>

      {/* 2. WhatsApp */}
      <button
        type="button"
        onClick={handleWhatsApp}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-sans text-[#F5F1E8] hover:bg-white/[0.06] hover:text-[#C9A96E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
      >
        <MessageSquare className="w-4 h-4 text-[#A8B0BD]" />
        <span>WhatsApp</span>
      </button>

      {/* 3. Email */}
      <button
        type="button"
        onClick={handleEmail}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-sans text-[#F5F1E8] hover:bg-white/[0.06] hover:text-[#C9A96E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
      >
        <Mail className="w-4 h-4 text-[#A8B0BD]" />
        <span>Email</span>
      </button>

      {/* 4. Native share (if supported) */}
      {hasNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-sans text-[#F5F1E8] hover:bg-white/[0.06] hover:text-[#C9A96E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
        >
          <Share2 className="w-4 h-4 text-[#A8B0BD]" />
          <span>Share</span>
        </button>
      )}
    </div>
  );

  const triggerButton = (
    <Button
      variant="outline"
      className="h-[44px] px-5 rounded-xl border border-white/15 bg-transparent hover:border-[#C9A96E]/50 hover:bg-white/[0.04] text-[#F5F1E8] text-xs font-sans font-medium transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B14] w-full sm:w-auto shrink-0"
    >
      <Share2 className="w-4 h-4 text-[#C9A96E]" />
      <span>Share This Calculation</span>
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent className="bg-[#0B1220] border-t border-white/10 p-4 text-[#F5F1E8]">
          <div className="max-w-sm mx-auto w-full pt-2 pb-4">
            {shareItems}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-56 p-1.5 rounded-2xl bg-[#0B1220] border border-white/10 shadow-2xl text-[#F5F1E8] z-50 focus:outline-none"
      >
        {shareItems}
      </PopoverContent>
    </Popover>
  );
}
