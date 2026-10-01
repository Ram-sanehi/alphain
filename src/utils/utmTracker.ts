/**
 * UTM Tracking and DPDP Consent Utilities
 * Automatically captures campaign attribution parameters and preserves them throughout the session.
 */

export interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landing_page?: string;
  timestamp?: string;
}

const STORAGE_KEY = "aim_fiduciary_utm_data";

export function initializeUtmTracking(): void {
  if (typeof window === "undefined") return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const hasUtm =
      urlParams.has("utm_source") ||
      urlParams.has("utm_medium") ||
      urlParams.has("utm_campaign") ||
      urlParams.has("gclid") ||
      urlParams.has("fbclid");

    if (hasUtm || !sessionStorage.getItem(STORAGE_KEY)) {
      const data: UtmData = {
        utm_source: urlParams.get("utm_source") || undefined,
        utm_medium: urlParams.get("utm_medium") || undefined,
        utm_campaign: urlParams.get("utm_campaign") || undefined,
        utm_term: urlParams.get("utm_term") || undefined,
        utm_content: urlParams.get("utm_content") || undefined,
        gclid: urlParams.get("gclid") || undefined,
        fbclid: urlParams.get("fbclid") || undefined,
        referrer: document.referrer || "direct",
        landing_page: window.location.pathname,
        timestamp: new Date().toISOString(),
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (e) {
    console.debug("Attribution tracking initialized:", e);
  }
}

export function getStoredUtmData(): UtmData {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Trigger GA4 / Meta Pixel event if consented
 */
export function trackAnalyticsEvent(eventName: string, params: Record<string, any> = {}): void {
  if (typeof window === "undefined") return;

  const consent = localStorage.getItem("aim_dpdp_cookie_consent");
  if (consent !== "accepted") {
    // Analytics disabled until explicit DPDP consent is granted
    return;
  }

  // Google Analytics gtag trigger
  if ((window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }

  // Meta Pixel fbq trigger
  if ((window as any).fbq) {
    (window as any).fbq("trackCustom", eventName, params);
  }
}
