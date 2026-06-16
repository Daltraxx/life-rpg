import { isValidCookiePayload } from "@/utils/helpers/is-valid-cookie-payload";
import { CookieStore } from "@/utils/types/cookies";
import crypto from "crypto";
import { COOKIES } from "@/utils/constants/cookies";

/**
 * Derives the pending email address awaiting verification from a signed, expiring cookie,
 * falling back to the provided value if the cookie is absent, invalid, expired, or unverifiable.
 *
 * The cookie is expected to contain two dot-delimited parts:
 *   1. A Base64URL-encoded JSON payload: { value: string; exp: number; nonce: string }
 *   2. An HMAC-SHA256 signature (Base64URL) over the UTF-8 JSON payload string.
 *
 * Validation steps:
 *   - Decode and parse the payload.
 *   - Recompute the HMAC-SHA256 signature using process.env.COOKIE_SIGNING_SECRET.
 *   - Reject if signatures differ.
 *   - Reject if current time is greater than or equal to payload.exp (epoch millis).
 *
 * On any validation failure (missing secret, bad format, bad signature, expired cookie, JSON error)
 * the function logs an error and returns the fallback email instead of throwing.
 *
 * Security notes:
 *   - Uses HMAC for integrity; does not encrypt the payload. Do not place sensitive data beyond the email.
 *   - Relies on Base64URL encoding (no padding) for both payload and signature.
 *   - Ensure COOKIE_SIGNING_SECRET is a sufficiently random, long secret (e.g., 32+ bytes).
 *
 * @param cookieStore A read-only cookie store abstraction (e.g., from Next.js) used to access "pending_verification".
 * @param fallback A trusted email value to return if no valid pending verification cookie is found.
 * @returns The email extracted from a valid, unexpired, signed cookie; otherwise the provided fallback.
 *
 * @example
 * // For use in a Next.js server component page:
 * const email = getPendingVerificationEmailCookie(cookiesStore, user.email);
 * return <VerifyEmail email={email} />;
 * }
 *
 * @remarks
 * This helper is resilient: all internal errors are caught and logged. It never throws.
 * Prefer rotating the signing secret periodically; doing so will invalidate existing pending cookies.
 */
export default function getPendingVerificationEmailCookie(
  cookieStore: CookieStore,
  fallback: string,
): string {
  let email = fallback;
  const pendingVerificationCookie = cookieStore.get(COOKIES.PENDING_EMAIL_VERIFICATION);
  if (pendingVerificationCookie) {
    try {
      const parts = pendingVerificationCookie.value.split(".");
      if (parts.length !== 2) {
        throw new Error("Invalid cookie format");
      }
      const [payloadB64, signature] = parts;

      // Verify signature
      const secret = process.env.COOKIE_SIGNING_SECRET;
      if (!secret) throw new Error("Missing secret");

      const serialized = Buffer.from(payloadB64, "base64url").toString();
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(serialized)
        .digest("base64url");

      if (
        !crypto.timingSafeEqual(
          Buffer.from(signature, "base64url"),
          Buffer.from(expectedSignature, "base64url"),
        )
      ) {
        throw new Error("Invalid signature");
      }

      const payload: unknown = JSON.parse(serialized);
      if (!isValidCookiePayload(payload)) {
        throw new Error("Invalid payload structure");
      }

      // Check expiration
      if (Date.now() >= payload.exp) {
        cookieStore.delete(COOKIES.PENDING_EMAIL_VERIFICATION); // Clean up expired cookie
        return email; // Expired cookie, return fallback
      }
      email = payload.value;
    } catch (error) {
      console.error(
        `Invalid ${COOKIES.PENDING_EMAIL_VERIFICATION} cookie:`,
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }
  return email;
}
