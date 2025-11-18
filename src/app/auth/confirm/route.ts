import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = "profile-setup"; // Redirect to profile setup after confirmation

  // Create redirect link without secret token in URL for security
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (token_hash && type) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      redirectTo.searchParams.delete("next"); // Part of supabase docs, remove if unnecessary
      return NextResponse.redirect(redirectTo);
    } else {
      console.error("Error confirming email:", error.message, error.code, { type });
    }
  }

  // On failure, redirect to error page with some instructions
  redirectTo.pathname = "/error";
  redirectTo.searchParams.set(
    "message",
    "Email confirmation failed. Please try again later."
  );
  return NextResponse.redirect(redirectTo);
}
