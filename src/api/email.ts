import { supabase } from "@/integrations/supabase/client";

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  goal: string;
  message?: string;
  honeypot?: string;
  formStartTime?: number;
  consent: boolean;
}

export interface SubmitResponse {
  success: boolean;
  refNumber?: string;
  message?: string;
  simulated?: boolean;
}

/**
 * Submits contact inquiry to /api/contact backend endpoint.
 * Emails alphainvestmentmnt@gmail.com and stores the record.
 * Falls back to Supabase if configured and provides graceful error handling.
 */
export async function submitContactInquiry(data: ContactPayload): Promise<SubmitResponse> {
  // 1. Silent trap for bots filling honeypot
  if (data.honeypot && data.honeypot.trim().length > 0) {
    return { success: true, refNumber: "AIM-TRAP-BOT", simulated: true };
  }

  // 2. Primary: Submit to backend API endpoint /api/contact
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => null);

    if (response.ok && result?.success) {
      return {
        success: true,
        refNumber: result.refNumber || `AIM-${Date.now().toString().slice(-6)}`,
        message: result.message || "Thank you. Our advisory desk will respond within 1 business day.",
      };
    }

    if (response.status === 400 && result?.errors) {
      const err = new Error(result.error || "Please review the highlighted fields.");
      (err as any).fieldErrors = result.errors;
      throw err;
    }

    if (response.status === 429) {
      throw new Error(result?.error || "Submission rate limit reached. Please call our desk or WhatsApp directly.");
    }
  } catch (apiErr: any) {
    // If it's a validation error or rate limit, rethrow directly
    if (apiErr.fieldErrors || (apiErr.message && apiErr.message.includes("rate limit"))) {
      throw apiErr;
    }
    console.warn("Backend /api/contact unreachable or failed:", apiErr);
  }

  // 3. Secondary Fallback: Supabase Client (if VITE_SUPABASE_URL is configured)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes("placeholder")) {
    try {
      const { data: dbData, error } = await supabase
        .from("contact_submissions")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.goal,
          message: data.message || "",
          status: "pending",
        })
        .select()
        .single();

      if (!error) {
        const refNumber = `AIM-${(dbData?.id || Date.now().toString()).slice(0, 8).toUpperCase()}`;
        return {
          success: true,
          refNumber,
          message: "Thank you. Our advisory desk will respond within 1 business day.",
        };
      }
    } catch (sbErr) {
      console.warn("Supabase fallback insert failed:", sbErr);
    }
  }

  // 4. If both backend and database failed, generate actionable error with fallback
  throw new Error(
    "Unable to deliver your enquiry to our mail server at this moment. Please use the WhatsApp button below or call our Pune desk directly."
  );
}

// Backward-compatible wrapper for legacy callers
export async function sendContactFormEmail(
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string
) {
  return submitContactInquiry({
    name,
    email,
    phone,
    goal: subject,
    message,
    consent: true,
  });
}
