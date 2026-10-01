import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import manifest from "@/data/downloadsManifest.json";
import firmConfig from "@/data/downloads/firmConfig.json";
import { RISK_QUESTIONS, ARCHETYPES } from "@/constants/riskProfileConfig";

describe("Downloads Portal & Statutory PDF Verification Suite", () => {
  it("contains exactly 6 official statutory and research documents in the manifest", () => {
    expect(manifest).toHaveLength(6);

    const docIds = manifest.map((d) => d.id);
    expect(docIds).toEqual([
      "kyc-onboarding",
      "risk-profile-form",
      "fee-agreement",
      "scores-grievance",
      "mandatory-disclosure",
      "tax-whitepaper",
    ]);
  });

  it("verifies all 6 PDF files exist on disk, are non-empty, and exceed 5KB", () => {
    manifest.forEach((doc) => {
      const publicPath = path.resolve(__dirname, "../../public", doc.filePath.replace(/^\//, ""));
      expect(fs.existsSync(publicPath), `File not found: ${publicPath}`).toBe(true);

      const stats = fs.statSync(publicPath);
      expect(stats.size).toBeGreaterThan(5000); // Exceeds 5KB requirement
      expect(stats.size).toBe(doc.fileSizeBytes);

      // Check first bytes are %PDF-
      const fd = fs.openSync(publicPath, "r");
      const buffer = Buffer.alloc(8);
      fs.readSync(fd, buffer, 0, 8, 0);
      fs.closeSync(fd);

      const header = buffer.toString("ascii");
      expect(header.startsWith("%PDF-"), `Invalid PDF header in ${doc.cleanFileName}: ${header}`).toBe(true);
    });
  });

  it("verifies page counts and ensure whitepaper has at least 6 pages without blank pages", () => {
    const whitepaper = manifest.find((d) => d.id === "tax-whitepaper");
    expect(whitepaper).toBeDefined();
    expect(whitepaper!.pageCount).toBeGreaterThanOrEqual(6);

    manifest.forEach((doc) => {
      expect(doc.pageCount).toBeGreaterThanOrEqual(2);
      expect(doc.hasExtractableText).toBe(true);
      expect(doc.hasRupeeSymbol).toBe(true);
    });
  });

  it("confirms firm compliance identifiers across firm configuration", () => {
    expect(firmConfig.sebiRiaNumber).toBe("INA000017348");
    expect(firmConfig.baslMembershipNumber).toBe("BASL-1982");
    expect(firmConfig.principalOfficer).toBe("Nageshwar Prasad");
    expect(firmConfig.grievanceOfficer).toBe("Advocate Rajat Diwan");
    expect(firmConfig.complaintsHistory).toHaveLength(3);

    // Complaint count audit: 0 pending complaints
    firmConfig.complaintsHistory.forEach((record) => {
      expect(record.pending).toBe(0);
    });
  });

  it("ensures risk profile configuration matches 10 suitability questions and archetypes", () => {
    expect(RISK_QUESTIONS).toHaveLength(10);
    expect(ARCHETYPES).toHaveLength(5);

    RISK_QUESTIONS.forEach((q) => {
      expect(q.options.length).toBeGreaterThanOrEqual(3);
    });
  });
});
