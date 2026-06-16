import { CookieStore, SetCookieResponse } from "@/utils/types/cookies";
import { COOKIES } from "@/utils/constants/cookies";

/**
 * Sets an "unverified_signup" HTTP-only cookie to flag that a user has begun (but not yet completed)
 * an email / account verification flow.
 *
 * The cookie:
 * - Name: "unverified_signup"
 * - Value: "true"
 * - Lifetime: 2 hours (configurable here by maxAge)
 * - Scope: Path "/"
 * - Security:
 *   - httpOnly: Prevents client-side JavaScript access (mitigates XSS leakage).
 *   - secure: Enabled automatically in production environments.
 *   - sameSite: "lax" to balance CSRF protection with typical navigation flows.
 *
 * Intended usage:
 * - Call this early in a signup pipeline after capturing initial user intent (e.g., after form submit).
 * - Downstream logic can read the presence of this cookie to gate actions (e.g., resending verification emails)
 * - or grant access to verify-email page.
 * - The cookie naturally expires; you may also explicitly clear it upon successful verification.
 *
 * Side effects:
 * - Mutates the provided cookie store by adding (or overwriting) the "unverified_signup" cookie.
 *
 * @param cookieStore A readonly wrapper for the request cookie store (e.g., from Next.js App Router),
 *                    used here to set a server-managed session-scoped flag.
 *
 * @returns An object indicating the success status, cookie name, expiration time, and any error message if applicable.
 *
 * @example
 * // In a Next.js route handler:
 * import { cookies } from "next/headers";
 * import setUnverifiedSignupCookie from "@/utils/cookies/setUnverifiedSignupCookie";
 *
 * export async function POST() {
 *   const store = cookies();
 *   setUnverifiedSignupCookie(store);
 *   return new Response(null, { status: 204 });
 * }
 *
 * @remarks If you later need to clear this cookie manually, set the same name with an immediate expiration
 * (e.g., maxAge: 0) or use a delete helper if available.
 */
export default function setUnverifiedSignupCookie(
  cookieStore: CookieStore,
): SetCookieResponse {
  const ttlSeconds = 60 * 60 * 2; // 2 hours
  try {
    cookieStore.set(COOKIES.UNVERIFIED_SIGNUP, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ttlSeconds,
      path: "/",
    });
    return {
      ok: true,
      cookieName: COOKIES.UNVERIFIED_SIGNUP,
      expiresAt: Date.now() + ttlSeconds * 1000,
    };
  } catch (error) {
    console.error(`Failed to set ${COOKIES.UNVERIFIED_SIGNUP} cookie:`, error);
    return {
      ok: false,
      cookieName: COOKIES.UNVERIFIED_SIGNUP,
      expiresAt: 0,
      error: "Failed to set cookie",
    };
  }
}
