import type { ResponseCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { CookiePayload } from "./setPendingVerificationEmail";
import crypto from "crypto";

const isValidCookiePayload = (payload: unknown): payload is CookiePayload => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "email" in payload &&
    typeof payload.email === "string" &&
    "exp" in payload &&
    typeof payload.exp === "number"
  );
};

/**
 * Derives the pending email address awaiting verification from a signed, expiring cookie,
 * falling back to the provided value if the cookie is absent, invalid, expired, or unverifiable.
 *
 * The cookie (named "pending_verification") is expected to contain two dot-delimited parts:
 *   1. A Base64URL-encoded JSON payload: { email: string; exp: number }
 *   2. An HMAC-SHA256 signature (Base64URL) over the UTF-8 JSON payload string.
 *
 * Validation steps:
 *   - Decode and parse the payload.
 *   - Recompute the HMAC-SHA256 signature using process.env.COOKIE_SIGNING_SECRET.
 *   - Reject if signatures differ.
 *   - Reject if current time exceeds payload.exp (epoch millis).
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
 * const email = getPendingVerificationEmail(cookiesStore, user.email);
 * return <VerifyEmail email={email} />;
 * }
 *
 * @remarks
 * This helper is resilient: all internal errors are caught and logged. It never throws.
 * Prefer rotating the signing secret periodically; doing so will invalidate existing pending cookies.
 */
export default function getPendingVerificationEmail(
  cookieStore: ResponseCookies,
  fallback: string
): string {
  let email = fallback;
  const pendingVerification = cookieStore.get("pending_verification");
  if (pendingVerification) {
    try {
      const parts = pendingVerification.value.split(".");
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
          Buffer.from(expectedSignature, "base64url")
        )
      ) {
        throw new Error("Invalid signature");
      }

      const payload: CookiePayload = JSON.parse(serialized);
      if (!isValidCookiePayload(payload)) {
        throw new Error("Invalid payload structure");
      }

      // Check expiration
      if (Date.now() >= payload.exp) {
        throw new Error("Cookie expired");
      }
      email = payload.email;
    } catch (error) {
      console.error(
        "Invalid cookie:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
  return email;
}
