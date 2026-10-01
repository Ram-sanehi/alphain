/**
 * Alpha Investment Management - Centralized Contact & Compliance Configuration
 * SEBI Registered Investment Adviser (Registration No. INA000017348 · BASL-1982)
 *
 * All public contact details, regulatory wording, commitments, and disclosures
 * are consolidated here for legal and compliance auditability.
 */

export const CONTACT_CONFIG = {
  firm: {
    legalName: "Alpha Investment Management",
    brandName: "Alpha Investment Management",
    sebiRiaNumber: "INA000017348",
    baslMembershipNumber: "BASL-1982",
    primaryPhone: "+91 96075 09586",
    primaryPhoneRaw: "+919607509586",
    officialEmail: "alphainvestmentmnt@gmail.com",
    whatsAppNumber: "+91 96075 09586",
    whatsAppRaw: "919607509586",
    whatsAppPrefilledText:
      "Hi, I would like to inquire about Alpha Investment Management fiduciary services.",
  },

  office: {
    label: "Principal Advisory Office",
    shopDetails: "Shop no 2, First Floor, Mahalungeker Complex",
    landmark: "Opposite R K Wine Shop · Mahalunge Ingale Kaman",
    highway: "Chakan-Talegaon Highway, Chakan",
    cityStateZip: "Pune, Maharashtra 410501",
    coordinates: {
      lat: 18.7599,
      lng: 73.834,
      display: "18.7599° N, 73.8340° E",
    },
    googleMapsEmbedUrl:
      "https://maps.google.com/maps?q=Shop%20no%202,%20First%20Floor,%20Mahalungeker%20Complex,%20Mahalunge%20Ingale%20Kaman,%20Chakan-Talegaon%20Highway,%20Chakan,%20Pune%20410501&t=&z=15&ie=UTF8&iwloc=&output=embed",
    googleMapsViewUrl:
      "https://www.google.com/maps/search/?api=1&query=18.7599,73.8340",
    googleMapsDirectionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=18.7599,73.8340",
  },

  workingHours: {
    timezone: "Asia/Kolkata",
    weekdays: "Mon – Fri: 9:00 AM – 6:00 PM IST",
    saturday: "Saturday: 10:00 AM – 2:00 PM IST",
    sunday: "Sunday: Closed · Pre-scheduled video slots only",
    slotsNote: "Pre-scheduled video slots available across all 7 days upon confirmation.",
  },

  tabs: {
    inquiry: {
      id: "inquiry",
      hash: "#inquiry",
      label: "Send an Inquiry",
      subtitle: "Confidential Advisory Consultation",
    },
    booking: {
      id: "book",
      hash: "#book",
      label: "Book a Video Slot",
      subtitle: "Live Video Conference (30 Mins)",
    },
  },

  commitments: {
    boxTitle: "Our Advisory Commitments", // Changed from "Regulatory Guarantees"
    items: [
      "Registered under SEBI (Investment Advisers) Regulations, 2013",
      "Pure fee-only advisory mandate — 0% commissions or referral cuts",
      "Direct non-custodial execution directly in client-owned demat accounts",
    ],
  },

  formCopy: {
    heading: "Consult with our Advisory Desk",
    subheading:
      "Share your wealth objectives. Our investment committee evaluates your requirements with strict fiduciary confidentiality and responds within 1 business day.",
    successHeadline: "Consultation Request Confirmed",
    successMessage:
      "Thank you. Our advisory desk will respond within 1 business day.",
    // Modified: removed "ever" from the marketing statement
    consentText:
      "I consent to Alpha Investment Management contacting me in accordance with the SEBI RIA code of conduct. No third-party marketing, no distributor sales calls.",
    privacyLine:
      "We use your details only to respond to this enquiry.",
    privacyLinkText: "Privacy Policy",
    privacyUrl: "/privacy-policy",
    statutoryFooter:
      "Alpha Investment Management is a SEBI Registered Investment Adviser (Registration No. INA000017348, BASL Membership No. 1982). Investments in securities market are subject to market risks. Read all scheme related documents carefully before investing.",
  },

  advisoryObjectives: [
    "Comprehensive Financial Planning & Goal Allocation",
    "Direct Equity & Liquid Debt Advisory (₹25L+)",
    "Tax-Loss Harvesting & Capital Gains Optimization",
    "Retirement Decumulation & Cash-Flow Architecture",
    "Loan Against Property & Debt Syndication",
    "Private Family Trust & Estate Succession",
    "General Fiduciary Inquiry",
  ],

  // Cal.com / Booking integration
  calendar: {
    bookingUrl: "https://cal.com/alpha-aim/30min",
    defaultEventTitle: "Introductory Wealth Consultation",
    duration: "30 Mins",
    format: "Google Meet / Phone · Free",
  },
} as const;
