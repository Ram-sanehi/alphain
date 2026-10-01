import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import https from "https";

// In-memory cache for crawled Indian stock data
let scrapedStocksCache: any[] = [
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

// Helper to query Yahoo Finance server-side
const fetchJson = (url: string, headers: Record<string, string>): Promise<any> => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", (err) => reject(err));
  });
};

// Start background crawler worker
let currentScrapeIndex = 0;
let scraperStarted = false;

const startScraperWorker = () => {
  if (scraperStarted) return;
  scraperStarted = true;

  const runNextScrape = async () => {
    const stock = scrapedStocksCache[currentScrapeIndex];
    if (stock) {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${stock.yahooSymbol}?interval=1d&range=1d`;
        const headers = {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        };
        const data = await fetchJson(url, headers);
        
        if (data && data.chart && data.chart.result && data.chart.result[0]) {
          const meta = data.chart.result[0].meta;
          const price = meta.regularMarketPrice;
          const prevClose = meta.chartPreviousClose;
          
          if (price !== undefined && price !== null) {
            const change = price - prevClose;
            const changePercent = (change / prevClose) * 100;
            
            scrapedStocksCache[currentScrapeIndex] = {
              ...stock,
              price: Math.round(price * 100) / 100,
              change: Math.round(change * 100) / 100,
              changePercent: Math.round(changePercent * 100) / 100,
              openPrice: Math.round(prevClose * 100) / 100
            };
          }
        }
      } catch (err) {
        // Ignore single failures
      }
    }
    
    currentScrapeIndex = (currentScrapeIndex + 1) % scrapedStocksCache.length;
    setTimeout(runNextScrape, 2000);
  };
  
  runNextScrape();
};

// Custom Vite plugin to serve the /api/quotes endpoint
const customScraperPlugin = () => ({
  name: "custom-scraper-plugin",
  configureServer(server: any) {
    startScraperWorker();

    // Strict 404 handler for missing downloads to prevent SPA fallback serving index.html
    server.middlewares.use((req: any, res: any, next: any) => {
      const urlPath = req.url ? req.url.split("?")[0] : "";
      if (urlPath.startsWith("/downloads/")) {
        const filePath = path.join(__dirname, "public", urlPath);
        if (!fs.existsSync(filePath)) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.end("404 Not Found: Requested PDF document does not exist.");
          return;
        }
      }
      next();
    });

    server.middlewares.use("/api/quotes", (req: any, res: any) => {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, s-maxage=20, stale-while-revalidate=30");
      const isMarketOpen = isIndianMarketOpenNow();
      res.end(JSON.stringify({
        quotes: scrapedStocksCache,
        isMarketOpen,
        marketStatus: isMarketOpen ? "Market Open" : "Market closed · last close",
        feedNotice: "Delayed 15 min",
        lastUpdated: new Date().toISOString()
      }));
    });

    server.middlewares.use("/api/live-indian-stocks", (req: any, res: any) => {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(JSON.stringify(scrapedStocksCache));
    });

    // In-memory rate limiting map: IP -> timestamp[]
    const contactRateLimits = new Map<string, number[]>();

    // Dedicated backend contact inquiry submission endpoint
    server.middlewares.use("/api/contact", (req: any, res: any) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
      }

      if (req.method !== "POST") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      let body = "";
      req.on("data", (chunk: any) => { body += chunk; });
      req.on("end", async () => {
        try {
          const data = JSON.parse(body || "{}");
          const { name, email, phone, goal, message, consent, honeypot, formStartTime } = data;

          // 1. Spam Trap 1: Honeypot field (hidden from real users)
          if (honeypot && String(honeypot).trim().length > 0) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: true, refNumber: "AIM-SPAM-DROPPED" }));
            return;
          }

          // 2. Spam Trap 2: Minimum submission time check (reject automated scripts under 2.5s)
          if (formStartTime && typeof formStartTime === "number") {
            const elapsedMs = Date.now() - formStartTime;
            if (elapsedMs < 2000) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Form submitted unnaturally quickly. Please review your input." }));
              return;
            }
          }

          // 3. Spam Protection 3: In-memory rate limiting (max 5 requests per 15 min per IP)
          const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "local";
          const now = Date.now();
          const ipTimes = (contactRateLimits.get(clientIp) || []).filter((t: number) => now - t < 15 * 60 * 1000);
          if (ipTimes.length >= 5) {
            res.statusCode = 429;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Submission rate limit reached. Please call our desk or message on WhatsApp (+91 96075 09586)." }));
            return;
          }
          ipTimes.push(now);
          contactRateLimits.set(clientIp, ipTimes);

          // 4. Server-Side Field Validation
          const errors: Record<string, string> = {};
          if (!name || typeof name !== "string" || name.trim().length < 2) {
            errors.name = "Full legal name is required (minimum 2 characters).";
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
            errors.email = "Please provide a valid email address.";
          }
          // 10-digit Indian mobile validation
          const cleanDigits = String(phone || "").replace(/[^\d]/g, "");
          const tenDigit = cleanDigits.length === 12 && cleanDigits.startsWith("91")
            ? cleanDigits.slice(2)
            : (cleanDigits.length === 11 && cleanDigits.startsWith("0") ? cleanDigits.slice(1) : cleanDigits);
          if (!/^[6-9]\d{9}$/.test(tenDigit)) {
            errors.phone = "Please provide a valid 10-digit Indian mobile number (e.g., 98230 12345).";
          }
          if (!goal || typeof goal !== "string" || goal.trim().length === 0) {
            errors.goal = "Please choose your primary advisory objective.";
          }
          if (message && typeof message === "string" && message.length > 1000) {
            errors.message = "Message cannot exceed 1,000 characters.";
          }
          if (!consent) {
            errors.consent = "Consent to fiduciary contact is required.";
          }

          if (Object.keys(errors).length > 0) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Validation failed", errors }));
            return;
          }

          // 5. Generate Official Unique Reference Number (AIM-YYYYMMDD-XXXX)
          const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
          const randPart = Math.floor(1000 + Math.random() * 9000);
          const refNumber = `AIM-${datePart}-${randPart}`;

          const enquiryRecord = {
            refNumber,
            submittedAt: new Date().toISOString(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: `+91 ${tenDigit}`,
            goal: goal.trim(),
            message: (message || "").trim(),
            consent: true,
            clientIp: String(clientIp),
            status: "pending_advisory_review",
            emailDispatched: false,
          };

          // 6. Local Storage Persistence in data/enquiries.json
          const enquiriesFilePath = path.join(__dirname, "data", "enquiries.json");
          let allEnquiries: any[] = [];
          try {
            if (fs.existsSync(enquiriesFilePath)) {
              const raw = fs.readFileSync(enquiriesFilePath, "utf-8");
              allEnquiries = JSON.parse(raw || "[]");
            }
          } catch (e) {
            allEnquiries = [];
          }
          allEnquiries.push(enquiryRecord);
          try {
            fs.writeFileSync(enquiriesFilePath, JSON.stringify(allEnquiries, null, 2), "utf-8");
          } catch (writeErr) {
            console.warn("Failed to write to data/enquiries.json:", writeErr);
          }

          // 7. Email Dispatch to alphainvestmentmnt@gmail.com via Resend (if RESEND_API_KEY is configured)
          const resendApiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY;
          if (resendApiKey) {
            try {
              const emailPayload = {
                from: "Alpha Advisory Desk <onboarding@resend.dev>",
                to: ["alphainvestmentmnt@gmail.com"],
                reply_to: enquiryRecord.email,
                subject: `[Ref: ${refNumber}] New Advisory Consultation Request: ${enquiryRecord.name}`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1e293b; line-height: 1.5;">
                    <h2 style="color: #070b14; border-bottom: 2px solid #c9a24b; padding-bottom: 8px;">New Advisory Consultation Request</h2>
                    <p><strong>Reference Number:</strong> ${refNumber}</p>
                    <p><strong>Submission Time:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                      <tr><td style="padding: 6px 0; color: #64748b; width: 150px;">Full Name:</td><td><strong>${enquiryRecord.name}</strong></td></tr>
                      <tr><td style="padding: 6px 0; color: #64748b;">Email Address:</td><td><a href="mailto:${enquiryRecord.email}">${enquiryRecord.email}</a></td></tr>
                      <tr><td style="padding: 6px 0; color: #64748b;">Phone Number:</td><td><a href="tel:${enquiryRecord.phone}">${enquiryRecord.phone}</a></td></tr>
                      <tr><td style="padding: 6px 0; color: #64748b;">Advisory Objective:</td><td><strong>${enquiryRecord.goal}</strong></td></tr>
                    </table>
                    <div style="margin-top: 16px; background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
                      <strong style="color: #070b14;">Client Context / Notes:</strong>
                      <p style="margin: 8px 0 0 0; white-space: pre-wrap; color: #334155;">${enquiryRecord.message || "No additional notes provided."}</p>
                    </div>
                    <p style="font-size: 11px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; pt: 12px;">
                      Alpha Investment Management · SEBI Registered Investment Adviser (INA000017348 · BASL-1982)<br/>
                      Shop no 2, First Floor, Mahalungeker Complex, Chakan-Talegaon Highway, Pune 410501
                    </p>
                  </div>
                `
              };

              const emailPostData = JSON.stringify(emailPayload);
              const emailReq = https.request({
                hostname: "api.resend.com",
                port: 443,
                path: "/emails",
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${resendApiKey}`,
                  "Content-Type": "application/json",
                  "Content-Length": Buffer.byteLength(emailPostData)
                }
              }, (emailRes) => {
                if (emailRes.statusCode && emailRes.statusCode < 300) {
                  enquiryRecord.emailDispatched = true;
                }
              });
              emailReq.on("error", (err) => console.warn("Resend email dispatch error:", err));
              emailReq.write(emailPostData);
              emailReq.end();
            } catch (err) {
              console.warn("Resend email exception:", err);
            }
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            success: true,
            refNumber,
            message: "Thank you. Our advisory desk will respond within 1 business day."
          }));
        } catch (parseErr) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Invalid JSON payload" }));
        }
      });
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api/yahoo": {
        target: "https://query1.finance.yahoo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ""),
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      }
    }
  },
  plugins: [react(), customScraperPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "ES2020",
    minify: "terser",
    cssCodeSplit: true,
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        passes: 2,
        pure_funcs: mode === "production" ? ["console.log", "console.info", "console.debug"] : [],
      },
    },
    rollupOptions: {},
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "lucide-react",
    ],
  },
}));
