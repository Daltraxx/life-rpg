import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  
  const typeParam = searchParams.get("type");
  const validTypes: EmailOtpType[] = [
    "signup",
    "recovery",
    "email_change",
    "magiclink",
  ] as const;
  const type =
    typeParam && validTypes.includes(typeParam as EmailOtpType)
      ? (typeParam as EmailOtpType)
      : null;
  
  const next = "profile-setup"; // Redirect to profile setup after confirmation

  // Create redirect link without secret token in URL for security
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
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
