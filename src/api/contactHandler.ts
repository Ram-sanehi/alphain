import * as fs from "fs";
import * as path from "path";
import * as https from "https";

export interface ContactInquiryInput {
  name: string;
  email: string;
  phone: string;
  goal: string;
  message?: string;
  consent: boolean;
  honeypot?: string;
  formStartTime?: number;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  goal?: string;
  message?: string;
  consent?: string;
}

export interface ContactInquiryResult {
  statusCode: number;
  data: {
    success?: boolean;
    refNumber?: string;
    message?: string;
    error?: string;
    errors?: ValidationErrors;
  };
}

// In-memory rate limiting map: IP -> timestamp[]
const contactRateLimits = new Map<string, number[]>();

export function sanitizeIndianPhone(raw: string): string {
  const digits = String(raw || "").replace(/[^\d]/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function validateInquiry(input: ContactInquiryInput): ValidationErrors {
  const errors: ValidationErrors = {};

  // 1. Name validation
  const trimmedName = (input.name || "").trim();
  if (!trimmedName || trimmedName.length < 2) {
    errors.name = "Full legal name is required (minimum 2 characters).";
  } else if (trimmedName.length > 100) {
    errors.name = "Name cannot exceed 100 characters.";
  }

  // 2. Email validation
  const trimmedEmail = (input.email || "").trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    errors.email = "Please provide a valid email address.";
  }

  // 3. Indian 10-digit mobile validation
  const cleanPhone = sanitizeIndianPhone(input.phone || "");
  if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
    errors.phone = "Please provide a valid 10-digit Indian mobile number (e.g. 98200 12345).";
  }

  // 4. Advisory Objective validation
  if (!input.goal || String(input.goal).trim().length === 0) {
    errors.goal = "Please choose your primary advisory objective.";
  }

  // 5. Message length validation
  if (input.message && input.message.length > 1000) {
    errors.message = "Message cannot exceed 1,000 characters.";
  }

  // 6. Mandatory Consent
  if (!input.consent) {
    errors.consent = "Consent to fiduciary contact is required.";
  }

  return errors;
}

export function handleContactInquiry(
  input: ContactInquiryInput,
  clientIp: string = "local",
  projectRoot: string = process.cwd()
): ContactInquiryResult {
  // 1. Spam Trap 1: Honeypot field (hidden from real users)
  if (input.honeypot && String(input.honeypot).trim().length > 0) {
    return {
      statusCode: 200,
      data: {
        success: true,
        refNumber: "AIM-SPAM-DROPPED",
        message: "Thank you. Our advisory desk will respond within 1 business day.",
      },
    };
  }

  // 2. Spam Trap 2: Minimum submission time check (< 2000ms is automated bot)
  if (input.formStartTime && typeof input.formStartTime === "number") {
    const elapsed = Date.now() - input.formStartTime;
    if (elapsed < 2000) {
      return {
        statusCode: 400,
        data: {
          error: "Form submitted unnaturally quickly. Please review your input.",
        },
      };
    }
  }

  // 3. Spam Protection 3: In-memory rate limiting (max 5 requests per 15 min per IP)
  const now = Date.now();
  const times = (contactRateLimits.get(clientIp) || []).filter((t) => now - t < 15 * 60 * 1000);
  if (times.length >= 5) {
    return {
      statusCode: 429,
      data: {
        error:
          "Submission rate limit reached. Please call our desk (+91 96075 09586) or message on WhatsApp.",
      },
    };
  }
  times.push(now);
  contactRateLimits.set(clientIp, times);

  // 4. Server-Side Field Validation
  const errors = validateInquiry(input);
  if (Object.keys(errors).length > 0) {
    return {
      statusCode: 400,
      data: {
        error: "Validation failed",
        errors,
      },
    };
  }

  // 5. Generate Official Unique Reference Number (AIM-YYYYMMDD-XXXX)
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randPart = Math.floor(1000 + Math.random() * 9000);
  const refNumber = `AIM-${datePart}-${randPart}`;
  const cleanPhone = sanitizeIndianPhone(input.phone);

  const enquiryRecord = {
    refNumber,
    submittedAt: new Date().toISOString(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: `+91 ${cleanPhone}`,
    goal: input.goal.trim(),
    message: (input.message || "").trim(),
    consent: true,
    clientIp,
    status: "pending_advisory_review",
    emailDispatched: false,
  };

  // 6. Local Storage Persistence in data/enquiries.json
  try {
    const dataDir = path.join(projectRoot, "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const enquiriesFilePath = path.join(dataDir, "enquiries.json");
    let allEnquiries: any[] = [];
    if (fs.existsSync(enquiriesFilePath)) {
      try {
        const raw = fs.readFileSync(enquiriesFilePath, "utf-8");
        allEnquiries = JSON.parse(raw || "[]");
      } catch {
        allEnquiries = [];
      }
    }
    allEnquiries.push(enquiryRecord);
    fs.writeFileSync(enquiriesFilePath, JSON.stringify(allEnquiries, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not save to data/enquiries.json:", err);
  }

  // 7. Email Dispatch via Resend (if RESEND_API_KEY is configured in environment)
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
            <p style="font-size: 11px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
              Alpha Investment Management · SEBI Registered Investment Adviser (INA000017348 · BASL-1982)<br/>
              Shop no 2, First Floor, Mahalungeker Complex, Chakan-Talegaon Highway, Pune 410501
            </p>
          </div>
        `,
      };

      const emailPostData = JSON.stringify(emailPayload);
      const emailReq = https.request(
        {
          hostname: "api.resend.com",
          port: 443,
          path: "/emails",
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(emailPostData),
          },
        },
        (emailRes) => {
          if (emailRes.statusCode && emailRes.statusCode < 300) {
            enquiryRecord.emailDispatched = true;
          }
        }
      );
      emailReq.on("error", (err) => console.warn("Resend email dispatch error:", err));
      emailReq.write(emailPostData);
      emailReq.end();
    } catch (err) {
      console.warn("Resend email exception:", err);
    }
  }

  return {
    statusCode: 200,
    data: {
      success: true,
      refNumber,
      message: "Thank you. Our advisory desk will respond within 1 business day.",
    },
  };
}
