import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

/**
 * Handles confirmation links for Supabase Auth by verifying a one-time password (OTP)
 * and redirecting the user to the appropriate page.
 *
 * Query parameters:
 * - token_hash: Hashed OTP token included in the confirmation link email.
 * - type: Verification type; one of "signup" | "recovery" | "email_change" | "magiclink" | "email" | "invite".
 *
 * Behavior:
 * - Validates required query parameters and allowed verification types.
 * - Uses `supabase.auth.verifyOtp` to complete verification with `type` and `token_hash`.
 * - Removes sensitive parameters (`token_hash`, `type`) and the optional `next` param from the URL before redirecting.
 * - On successful verification, redirects to the account setup page.
 * - On invalid/missing parameters or verification failure, redirects to a generic error page with a helpful message.
 *
 * Security:
 * - Strips `token_hash` from the redirect URL to prevent leaking secrets via browser history, logs, or referrers.
 *
 * Redirects:
 * - Success: `/account-setup`
 * - Failure: `/error?message=...`
 *
 * Logging:
 * - Logs verification errors to the server console for observability without exposing details to the client.
 *
 * @param request - The Next.js request containing the confirmation query parameters.
 * @returns A redirect response to either the profile setup page or an error page with guidance.
 */
export async function GET(request: NextRequest) {
  // TODO: rate limit this endpoint to prevent abuse
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");

  const validTypes: readonly EmailOtpType[] = [
    "signup",
    "recovery",
    "email_change",
    "magiclink",
    "email",
    "invite",
  ];
  const typeParam = searchParams.get("type");
  const type =
    typeParam && validTypes.includes(typeParam as EmailOtpType)
      ? (typeParam as EmailOtpType)
      : null;

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

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    redirectTo.pathname = "/error";
    redirectTo.searchParams.set(
      "message",
      "An unexpected error occurred. Please try again."
    );
    return NextResponse.redirect(redirectTo);
  }

  let error;
  try {
    ({ error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    }));
  } catch (err) {
    console.error("Exception during OTP verification:", err);
    redirectTo.pathname = "/error";
    redirectTo.searchParams.set(
      "message",
      "An unexpected error occurred during verification. Please try again."
    );
    return NextResponse.redirect(redirectTo);
  }

  if (!error) {
    // On success redirect to account setup page
    redirectTo.searchParams.delete("next"); // Part of supabase docs, remove if unnecessary
    redirectTo.pathname = "/account-setup";
    return NextResponse.redirect(redirectTo);
  }

  console.error("Error confirming email:", error.message, error.code, {
    type,
  });

  let errorMessage =
    "Confirmation link has expired or already been used. Please request a new one.";
  // Provide more specific messages based on error code
  switch (error.code) {
    case "otp_expired":
      errorMessage =
        "This confirmation link has expired. Please request a new one.";
      break;
    case "otp_disabled":
      errorMessage =
        "This confirmation link has already been used. Please request a new one.";
      break;
    case "user_banned":
      errorMessage =
        "Your account has been suspended. Please contact support for assistance.";
      break;
    case "validation_failed":
      errorMessage =
        "Invalid confirmation link or parameters. Please check the link and try again, or request a new confirmation email.";
      break;
    case "over_email_send_rate_limit":
      errorMessage =
        "Too many email confirmation requests. Please wait a few minutes before trying again.";
      break;
    case "over_sms_send_rate_limit":
      errorMessage =
        "Too many SMS confirmation requests. Please wait a few minutes before trying again.";
      break;
    case "over_request_rate_limit":
      errorMessage =
        "Too many confirmation attempts. Please wait a few minutes before trying again.";
      break;
    case "email_provider_disabled":
      errorMessage =
        "Email confirmation service is temporarily unavailable. Please try again later or contact support.";
      break;
    case "phone_provider_disabled":
      errorMessage =
        "SMS confirmation service is temporarily unavailable. Please try again later or contact support.";
      break;
    case "mfa_verification_failed":
      errorMessage =
        "Multi-factor authentication verification failed. Please check your authentication method and try again.";
      break;
  }

  // On failure, redirect to error page with some instructions
  redirectTo.pathname = "/error"; // TODO: create error page
  redirectTo.searchParams.set("message", errorMessage);
  return NextResponse.redirect(redirectTo);
}
