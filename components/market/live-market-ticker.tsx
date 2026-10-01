"use client";

import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  prevClose: number;
}

interface QuotesApiResponse {
  quotes: StockQuote[];
  isMarketOpen: boolean;
  marketStatus: string;
  feedNotice: string;
  lastUpdated: string;
}

const initialFallbackQuotes: StockQuote[] = [
  { symbol: "NIFTY 50", name: "Nifty 50 Index", price: 25790.95, change: 165.40, changePercent: 0.65, prevClose: 25625.55 },
  { symbol: "SENSEX", name: "BSE Sensex Index", price: 84299.90, change: 535.15, changePercent: 0.64, prevClose: 83764.75 },
  { symbol: "BANKNIFTY", name: "Nifty Bank Index", price: 53845.20, change: 310.80, changePercent: 0.58, prevClose: 53534.40 },
  { symbol: "RELIANCE", name: "Reliance Industries", price: 3012.40, change: 38.60, changePercent: 1.30, prevClose: 2973.80 },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 4295.50, change: -28.30, changePercent: -0.65, prevClose: 4323.80 },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1724.80, change: 21.40, changePercent: 1.26, prevClose: 1703.40 },
  { symbol: "INFY", name: "Infosys", price: 1912.15, change: 32.50, changePercent: 1.73, prevClose: 1879.65 },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1285.60, change: 16.70, changePercent: 1.32, prevClose: 1268.90 },
  { symbol: "SBIN", name: "State Bank of India", price: 834.75, change: 12.30, changePercent: 1.49, prevClose: 822.45 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1648.20, change: 24.80, changePercent: 1.53, prevClose: 1623.40 },
  { symbol: "ITC", name: "ITC Limited", price: 512.60, change: -3.40, changePercent: -0.66, prevClose: 516.00 }
];

function checkIsIndianMarketOpen(): boolean {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  const day = istTime.getUTCDay();
  const minutes = istTime.getUTCHours() * 60 + istTime.getUTCMinutes();
  return day >= 1 && day <= 5 && minutes >= 555 && minutes <= 930;
}

export function LiveMarketTicker() {
  const [quotes, setQuotes] = useState<StockQuote[]>(initialFallbackQuotes);
  const [isMarketOpen, setIsMarketOpen] = useState(checkIsIndianMarketOpen);
  const [feedError, setFeedError] = useState(false);
  const prevPricesRef = useRef<Record<string, number>>({});
  const [flashingSymbols, setFlashingSymbols] = useState<Record<string, "up" | "down">>({});

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/quotes");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: QuotesApiResponse = await res.json();
      if (data && data.quotes && data.quotes.length > 0) {
        // Track price changes for flash animation
        const newFlashes: Record<string, "up" | "down"> = {};
        data.quotes.forEach((q) => {
          const prev = prevPricesRef.current[q.symbol];
          if (prev !== undefined && prev !== q.price) {
            newFlashes[q.symbol] = q.price > prev ? "up" : "down";
          }
          prevPricesRef.current[q.symbol] = q.price;
        });

        setQuotes(data.quotes);
        setIsMarketOpen(data.isMarketOpen);
        setFeedError(false);

        if (Object.keys(newFlashes).length > 0) {
          setFlashingSymbols(newFlashes);
          setTimeout(() => setFlashingSymbols({}), 1200);
        }
      }
    } catch {
      setFeedError(true);
    }
  };

  useEffect(() => {
    fetchQuotes();

    // Check market status every minute
    const marketCheckTimer = setInterval(() => {
      setIsMarketOpen(checkIsIndianMarketOpen());
    }, 60000);

    // Poll every 30s only during market hours
    const pollInterval = isMarketOpen ? 30000 : 0;
    let pollTimer: any = null;
    if (pollInterval > 0) {
      pollTimer = setInterval(() => {
        if (!document.hidden) {
          fetchQuotes();
        }
      }, pollInterval);
    }

    return () => {
      clearInterval(marketCheckTimer);
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [isMarketOpen]);

  return (
    <div
      className="relative z-30 w-full h-10 bg-[#050811] border-y border-white/[0.08] flex items-center overflow-hidden select-none"
      role="region"
      aria-label="Live Indian Stock Market Ticker"
    >
      {/* Left Badge: Market Hours & Feed Status */}
      <div className="flex-shrink-0 h-full px-3.5 sm:px-4 bg-[#070B14] border-r border-white/[0.08] flex items-center gap-2 z-20 shadow-lg">
        <span
          className={`w-2 h-2 rounded-full ${
            isMarketOpen
              ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"
              : "bg-slate-500"
          }`}
        />
        <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-wider text-slate-300 uppercase whitespace-nowrap">
          {isMarketOpen ? "Market Open" : "Market closed · last close"}
        </span>
        <span className="text-[9px] font-mono text-[#C9A24B] uppercase tracking-wider hidden md:inline-block px-1.5 py-0.5 rounded bg-[#C9A24B]/10 border border-[#C9A24B]/20">
          Delayed 15 min
        </span>
        {feedError && (
          <span title="Serving cached snapshot" className="text-amber-400">
            <AlertCircle className="w-3 h-3" />
          </span>
        )}
      </div>

      {/* Marquee Track: Seamless Horizontal Scroll with Pause on Hover */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="ticker-track flex items-center whitespace-nowrap hover:[animation-play-state:paused] cursor-default">
          {[...quotes, ...quotes].map((item, idx) => {
            const isPositive = item.change >= 0;
            const flash = flashingSymbols[item.symbol];

            return (
              <div
                key={`${item.symbol}-${idx}`}
                className={`inline-flex items-center gap-2.5 px-4 sm:px-5 py-1 text-xs border-r border-white/[0.06] transition-colors duration-300 ${
                  flash === "up"
                    ? "bg-emerald-500/20"
                    : flash === "down"
                    ? "bg-rose-500/20"
                    : ""
                }`}
              >
                <span className="font-sans font-semibold text-[#F5F1E8] tracking-wider text-[11px]">
                  {item.symbol}
                </span>

                <span className="font-mono tabular-nums text-slate-200 text-xs font-medium">
                  ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>

                <span
                  className={`inline-flex items-center gap-0.5 font-mono tabular-nums text-[11px] font-medium ${
                    isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {item.change.toFixed(2)} ({isPositive ? "+" : ""}
                    {item.changePercent.toFixed(2)}%)
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes tickerMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: tickerMarquee 42s linear infinite;
        }
      `}</style>
    </div>
  );
}
