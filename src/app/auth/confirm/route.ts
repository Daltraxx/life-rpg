import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

/**
 * Handles confirmation links for Supabase Auth by verifying a one-time password (OTP)
 * and redirecting the user to the appropriate page.
 *
 * Query parameters:
 * - token_hash: Hashed OTP token included in the confirmation link email.
 * - type: Verification type; one of "signup" | "recovery" | "email_change" | "magiclink".
 *
 * Behavior:
 * - Validates required query parameters and allowed verification types.
 * - Uses `supabase.auth.verifyOtp` to complete verification with `type` and `token_hash`.
 * - Removes sensitive parameters (`token_hash`, `type`) and the optional `next` param from the URL before redirecting.
 * - On successful verification, redirects to the profile setup page.
 * - On invalid/missing parameters or verification failure, redirects to a generic error page with a helpful message.
 *
 * Security:
 * - Strips `token_hash` from the redirect URL to prevent leaking secrets via browser history, logs, or referrers.
 *
 * Redirects:
 * - Success: `/profile-setup`
 * - Failure: `/error?message=...`
 *
 * Logging:
 * - Logs verification errors to the server console for observability without exposing details to the client.
 *
 * @param request - The Next.js request containing the confirmation query parameters.
 * @returns A redirect response to either the profile setup page or an error page with guidance.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");

  const typeParam = searchParams.get("type");
  const validTypes: readonly EmailOtpType[] = [
    "signup",
    "recovery",
    "email_change",
    "magiclink",
  ];
  const type =
    typeParam && validTypes.includes(typeParam as EmailOtpType)
      ? (typeParam as EmailOtpType)
      : null;
  
  const next = "/profile-setup"; // Redirect to profile setup after confirmation

  // Create redirect link without secret token in URL for security
  const redirectTo = request.nextUrl.clone();
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (!token_hash || !type) {
    redirectTo.pathname = "/error";
    redirectTo.searchParams.set(
      "message",
      "Invalid confirmation link. Please check your email for the correct link."
    );
    return NextResponse.redirect(redirectTo);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  if (!error) {
    redirectTo.pathname = next;
    redirectTo.searchParams.delete("next"); // Part of supabase docs, remove if unnecessary
    return NextResponse.redirect(redirectTo);
  }

  console.error("Error confirming email:", error.message, error.code, {
    type,
  });

  // On failure, redirect to error page with some instructions
  redirectTo.pathname = "/error";
  redirectTo.searchParams.set(
    "message",
    "Confirmation link has expired or already been used. Please request a new one."
  );
  return NextResponse.redirect(redirectTo);
}
