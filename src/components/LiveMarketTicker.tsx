import React, { useState, useEffect, useRef } from "react";
import { useSWR } from "@/hooks/use-swr";
import { ArrowUpRight, TrendingUp, TrendingDown, Clock, AlertCircle } from "lucide-react";

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

// Fallback initial data in case of immediate network delay
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

// Helper to determine if Indian stock market is open in IST
function checkIsIndianMarketOpen(): boolean {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  const day = istTime.getUTCDay();
  const minutes = istTime.getUTCHours() * 60 + istTime.getUTCMinutes();
  // Monday(1) to Friday(5) between 09:15 AM (555 min) and 03:30 PM (930 min)
  return day >= 1 && day <= 5 && minutes >= 555 && minutes <= 930;
}

const fetcher = async (url: string): Promise<QuotesApiResponse> => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return {
        quotes: initialFallbackQuotes,
        isMarketOpen: checkIsIndianMarketOpen(),
        marketStatus: checkIsIndianMarketOpen() ? "Market Open" : "Market closed · last close",
        feedNotice: "Delayed 15 min",
        lastUpdated: new Date().toISOString(),
      };
    }
    return await res.json();
  } catch {
    return {
      quotes: initialFallbackQuotes,
      isMarketOpen: checkIsIndianMarketOpen(),
      marketStatus: checkIsIndianMarketOpen() ? "Market Open" : "Market closed · last close",
      feedNotice: "Delayed 15 min",
      lastUpdated: new Date().toISOString(),
    };
  }
};

export function LiveMarketTicker() {
  const [isMarketOpen, setIsMarketOpen] = useState(checkIsIndianMarketOpen);
  const prevPricesRef = useRef<Record<string, number>>({});
  const [flashingSymbols, setFlashingSymbols] = useState<Record<string, "up" | "down">>({});

  // Recalculate market hours status every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setIsMarketOpen(checkIsIndianMarketOpen());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Poll only during market hours (every 30s); pause outside market hours (0)
  const { data, error, isLoading, isValidating } = useSWR<QuotesApiResponse>(
    "/api/quotes",
    fetcher,
    {
      refreshInterval: isMarketOpen ? 30000 : 0,
      fallbackData: {
        quotes: initialFallbackQuotes,
        isMarketOpen,
        marketStatus: isMarketOpen ? "Market Open" : "Market closed · last close",
        feedNotice: "Delayed 15 min",
        lastUpdated: new Date().toISOString(),
      },
    }
  );

  const quotes = data?.quotes || initialFallbackQuotes;

  // Detect price changes to trigger green/red flash animation
  useEffect(() => {
    if (!quotes || quotes.length === 0) return;

    const newFlashes: Record<string, "up" | "down"> = {};
    quotes.forEach((q) => {
      const prev = prevPricesRef.current[q.symbol];
      if (prev !== undefined && prev !== q.price) {
        newFlashes[q.symbol] = q.price > prev ? "up" : "down";
      }
      prevPricesRef.current[q.symbol] = q.price;
    });

    if (Object.keys(newFlashes).length > 0) {
      setFlashingSymbols(newFlashes);
      const timeout = setTimeout(() => {
        setFlashingSymbols({});
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [quotes]);

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
        {error && (
          <span title="Serving cached snapshot" className="text-amber-400">
            <AlertCircle className="w-3 h-3" />
          </span>
        )}
      </div>

      {/* Marquee Track: Seamless Horizontal Scroll with Pause on Hover */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="ticker-track flex items-center whitespace-nowrap hover:[animation-play-state:paused] cursor-default">
          {/* Double track to ensure smooth continuous marquee loop */}
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
                {/* Symbol Name */}
                <span className="font-sans font-semibold text-[#F5F1E8] tracking-wider text-[11px]">
                  {item.symbol}
                </span>

                {/* Live / Last Close Price with Tabular Numbers */}
                <span className="font-mono tabular-nums text-slate-200 text-xs font-medium">
                  ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>

                {/* Change & Percent with Arrow */}
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

      {/* Inline styles for seamless infinite marquee */}
      <style>{`
        @keyframes tickerMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: tickerMarquee 42s linear infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none !important;
            transform: translate3d(0, 0, 0) !important;
          }
        }
      `}</style>
    </div>
  );
}
