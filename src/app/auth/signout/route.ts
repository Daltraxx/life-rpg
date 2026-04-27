import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Handles POST requests to sign out the current user.
 *
 * Checks if a user is currently authenticated via Supabase claims,
 * and if so, signs them out. After sign-out, revalidates the root layout
 * and redirects to the home page.
 *
 * @param req - The incoming NextRequest object
 * @returns A NextResponse that redirects to the home page with a 302 status code
 */
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();

  // Check if a user's logged in
  const { data: claimsData } = await supabase.auth.getClaims();

  if (claimsData?.claims) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return NextResponse.json(
        {
          error: error.message,
          redirectUrl: `/error?message=${error.message}&status=500`,
        },
        { status: 500 },
      );
    }
  }

  revalidatePath("/", "layout");
  return NextResponse.redirect(new URL("/", req.url), {
    status: 302,
  });
}
