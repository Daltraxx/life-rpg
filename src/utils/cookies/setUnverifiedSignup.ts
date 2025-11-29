// NOTE: Importing ReadonlyRequestCookies from "next/dist/server/web/spec-extension/adapters/request-cookies"
// relies on a deep internal Next.js path. This may break in future Next.js releases if internal APIs change.
// Prefer using public APIs or types if available, and monitor Next.js changelogs for breaking changes.
import type { ResponseCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

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
 * @example
 * // In a Next.js route handler:
 * import { cookies } from "next/headers";
 * import setUnverifiedSignup from "@/utils/cookies/setUnverifiedSignup";
 *
 * export async function POST() {
 *   const store = cookies();
 *   setUnverifiedSignup(store);
 *   return new Response(null, { status: 204 });
 * }
 *
 * @remarks If you later need to clear this cookie manually, set the same name with an immediate expiration
 * (e.g., maxAge: 0) or use a delete helper if available.
 */
export default function setUnverifiedSignup(
  cookieStore: ResponseCookies
) {
  cookieStore.set("unverified_signup", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2 hours
    path: "/",
  });
}
