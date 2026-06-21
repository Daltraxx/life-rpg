import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Handles POST requests to sign out the current user.
 *
 * Attempts to sign out the current user regardless of current auth state.
 * On success, revalidates the root layout and returns 204 so the client
 * can handle navigation.
 *
 * @returns A NextResponse with 204 on success, or 500 JSON on failure
 */
export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      return NextResponse.json(
        {
          error: "Unable to sign out. Please try again.",
        },
        { status: 500 },
      );
    }

    revalidatePath("/", "layout");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Unexpected error while signing out:", error);
    return NextResponse.json(
      {
        error: "Unable to sign out. Please try again.",
      },
      { status: 500 },
    );
  }
}
