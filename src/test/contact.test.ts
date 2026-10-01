import { describe, it, expect } from "vitest";
import { CONTACT_CONFIG } from "@/constants/contactCopy";
import fs from "fs";
import path from "path";

describe("Contact Page & Regulatory Compliance Verification Suite", () => {
  it("verifies official firm identifiers and contact coordinates", () => {
    expect(CONTACT_CONFIG.firm.sebiRiaNumber).toBe("INA000017348");
    expect(CONTACT_CONFIG.firm.baslMembershipNumber).toBe("BASL-1982");
    expect(CONTACT_CONFIG.firm.primaryPhone).toBe("+91 96075 09586");
    expect(CONTACT_CONFIG.firm.officialEmail).toBe("alphainvestmentmnt@gmail.com");
    expect(CONTACT_CONFIG.office.coordinates.lat).toBe(18.7599);
    expect(CONTACT_CONFIG.office.coordinates.lng).toBe(73.834);
  });

  it("verifies implementation leaks are removed from tab labels", () => {
    // Before: "Inquiry Form (Underline)" & "Book a Slot (Cal.com)"
    // After: "Send an Inquiry" & "Book a Video Slot"
    expect(CONTACT_CONFIG.tabs.inquiry.label).toBe("Send an Inquiry");
    expect(CONTACT_CONFIG.tabs.booking.label).toBe("Book a Video Slot");
    expect(CONTACT_CONFIG.tabs.inquiry.label).not.toContain("Underline");
    expect(CONTACT_CONFIG.tabs.booking.label).not.toContain("Cal.com");
  });

  it("verifies compliance wording changes: 'ever' removed and box retitled", () => {
    // Before: "Regulatory Guarantees" & "...no distributor sales calls, ever."
    // After: "Our Advisory Commitments" & "...no distributor sales calls."
    expect(CONTACT_CONFIG.commitments.boxTitle).toBe("Our Advisory Commitments");
    expect(CONTACT_CONFIG.formCopy.consentText).not.toContain("ever");
    expect(CONTACT_CONFIG.formCopy.consentText).toContain("No third-party marketing, no distributor sales calls.");
  });

  it("verifies DPDP Act 2023, data retention, and compliance officer are in Privacy Policy", () => {
    const privacyPolicyPath = path.resolve(__dirname, "../pages/PrivacyPolicy.tsx");
    const content = fs.readFileSync(privacyPolicyPath, "utf-8");

    expect(content).toContain("Digital Personal Data Protection (DPDP) Act, 2023");
    expect(content).toContain("minimum period of 5 years");
    expect(content).toContain("Advocate Rajat Diwan");
    expect(content).toContain("alphainvestmentmnt@gmail.com");
  });

  it("validates 10-digit Indian mobile numbers and sanitization rules", () => {
    const validIndianNumbers = ["9800000000", "9607509586", "+91 98765 43210", "09823012345", "7000000000"];
    const invalidNumbers = ["12345", "5555555555", "abcdefghij", "+1 800 123 4567"];

    const sanitizePhone = (raw: string) => {
      const digits = raw.replace(/[^\d]/g, "");
      if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
      if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
      return digits;
    };

    validIndianNumbers.forEach((num) => {
      const clean = sanitizePhone(num);
      expect(/^[6-9]\d{9}$/.test(clean), `Expected ${num} (cleaned: ${clean}) to be valid`).toBe(true);
    });

    invalidNumbers.forEach((num) => {
      const clean = sanitizePhone(num);
      expect(/^[6-9]\d{9}$/.test(clean), `Expected ${num} (cleaned: ${clean}) to be invalid`).toBe(false);
    });
  });

  it("handles valid backend inquiry submission, generates reference number, and stores in data/enquiries.json", async () => {
    const { handleContactInquiry } = await import("@/api/contactHandler");

    const validSubmission = {
      name: "Vikramaditya Singhania",
      email: "vikram@singhania-family.com",
      phone: "+91 98230 12345",
      goal: "Direct Equity & Liquid Debt Advisory (₹25L+)",
      message: "Requesting consultation regarding HNW asset allocation and estate succession.",
      consent: true,
      formStartTime: Date.now() - 5000, // 5 seconds elapsed
    };

    const result = handleContactInquiry(validSubmission, "test-ip-1");
    expect(result.statusCode).toBe(200);
    expect(result.data.success).toBe(true);
    expect(result.data.refNumber).toMatch(/^AIM-\d{8}-\d{4}$/);

    // Verify storage file exists and contains the enquiry
    const enquiriesFile = path.resolve(__dirname, "../../data/enquiries.json");
    expect(fs.existsSync(enquiriesFile)).toBe(true);
    const saved = JSON.parse(fs.readFileSync(enquiriesFile, "utf-8"));
    const match = saved.find((e: any) => e.refNumber === result.data.refNumber);
    expect(match).toBeDefined();
    expect(match.name).toBe("Vikramaditya Singhania");
    expect(match.phone).toBe("+91 9823012345");
  });

  it("drops honeypot bot submissions without storing in database", async () => {
    const { handleContactInquiry } = await import("@/api/contactHandler");

    const botSubmission = {
      name: "Automated Spammer",
      email: "spam@spambot.net",
      phone: "+91 98230 12345",
      goal: "General Fiduciary Inquiry",
      consent: true,
      honeypot: "http://buy-cheap-leads.com", // Filled honeypot
    };

    const result = handleContactInquiry(botSubmission, "test-ip-bot");
    expect(result.statusCode).toBe(200);
    expect(result.data.refNumber).toBe("AIM-SPAM-DROPPED");
  });

  it("rejects automated submissions completed unnaturally quickly (< 2000ms)", async () => {
    const { handleContactInquiry } = await import("@/api/contactHandler");

    const instantSubmission = {
      name: "Instant Bot",
      email: "instant@bot.org",
      phone: "+91 98230 12345",
      goal: "General Fiduciary Inquiry",
      consent: true,
      formStartTime: Date.now() - 500, // Only 500ms elapsed
    };

    const result = handleContactInquiry(instantSubmission, "test-ip-fast");
    expect(result.statusCode).toBe(400);
    expect(result.data.error).toContain("unnaturally quickly");
  });

  it("rejects messages exceeding 1000 characters", async () => {
    const { validateInquiry } = await import("@/api/contactHandler");

    const longMessage = "A".repeat(1001);
    const errors = validateInquiry({
      name: "Valid Name",
      email: "valid@email.com",
      phone: "9823012345",
      goal: "General Fiduciary Inquiry",
      message: longMessage,
      consent: true,
    });

    expect(errors.message).toContain("cannot exceed 1,000 characters");
  });
});

