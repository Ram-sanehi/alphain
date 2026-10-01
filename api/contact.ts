import { handleContactInquiry } from "../src/api/contactHandler";

export default async function handler(req: any, res: any) {
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

  let body = req.body;
  if (!body) {
    try {
      body = await new Promise((resolve) => {
        let data = "";
        req.on("data", (chunk: any) => { data += chunk; });
        req.on("end", () => {
          try { resolve(JSON.parse(data || "{}")); } catch { resolve({}); }
        });
        req.on("error", () => resolve({}));
      });
    } catch {
      body = {};
    }
  } else if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const clientIp = (req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"])) || "local";
  const result = handleContactInquiry(body, String(clientIp), "/tmp");

  res.statusCode = result.statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(result.data));
}
