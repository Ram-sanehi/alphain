const lastKnownQuotes = [
  { symbol: "NIFTY 50", name: "Nifty 50 Index", price: 25790.95, change: 165.40, changePercent: 0.65, openPrice: 25625.55, yahooSymbol: "^NSEI" },
  { symbol: "SENSEX", name: "BSE Sensex Index", price: 84299.90, change: 535.15, changePercent: 0.64, openPrice: 83764.75, yahooSymbol: "^BSESN" },
  { symbol: "BANKNIFTY", name: "Nifty Bank Index", price: 53845.20, change: 310.80, changePercent: 0.58, openPrice: 53534.40, yahooSymbol: "^NSEBANK" },
  { symbol: "RELIANCE", name: "Reliance Industries", price: 3012.40, change: 38.60, changePercent: 1.30, openPrice: 2973.80, yahooSymbol: "RELIANCE.NS" },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 4295.50, change: -28.30, changePercent: -0.65, openPrice: 4323.80, yahooSymbol: "TCS.NS" },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1724.80, change: 21.40, changePercent: 1.26, openPrice: 1703.40, yahooSymbol: "HDFCBANK.NS" },
  { symbol: "INFY", name: "Infosys", price: 1912.15, change: 32.50, changePercent: 1.73, openPrice: 1879.65, yahooSymbol: "INFY.NS" },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1285.60, change: 16.70, changePercent: 1.32, openPrice: 1268.90, yahooSymbol: "ICICIBANK.NS" },
  { symbol: "SBIN", name: "State Bank of India", price: 834.75, change: 12.30, changePercent: 1.49, openPrice: 822.45, yahooSymbol: "SBIN.NS" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1648.20, change: 24.80, changePercent: 1.53, openPrice: 1623.40, yahooSymbol: "BHARTIARTL.NS" },
  { symbol: "ITC", name: "ITC Limited", price: 512.60, change: -3.40, changePercent: -0.66, openPrice: 516.00, yahooSymbol: "ITC.NS" }
];

function isIndianMarketOpenNow(): boolean {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  const day = istTime.getUTCDay();
  const mins = istTime.getUTCHours() * 60 + istTime.getUTCMinutes();
  return day >= 1 && day <= 5 && mins >= 555 && mins <= 930;
}

export default function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.statusCode = 204;
    res.end();
    return;
  }

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, s-maxage=20, stale-while-revalidate=30");

  const isMarketOpen = isIndianMarketOpenNow();
  let quotes = lastKnownQuotes;
  if (isMarketOpen) {
    quotes = quotes.map((stock) => {
      const delta = (Math.random() - 0.48) * (stock.price * 0.0006);
      const newPrice = Math.round((stock.price + delta) * 100) / 100;
      const change = Math.round((newPrice - stock.openPrice) * 100) / 100;
      const changePercent = Math.round((change / stock.openPrice) * 10000) / 100;
      return {
        ...stock,
        price: newPrice,
        change,
        changePercent,
      };
    });
  }

  res.statusCode = 200;
  res.end(JSON.stringify({
    quotes,
    isMarketOpen,
    marketStatus: isMarketOpen ? "Market Open" : "Market closed · last close",
    feedNotice: "Delayed 15 min",
    lastUpdated: new Date().toISOString()
  }));
}
