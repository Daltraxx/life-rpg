import { CookieStore } from "@/utils/types/cookies";
import crypto from "crypto";

export type CookiePayload = {
  email: string;
  exp: number;
  nonce: string;
};

const COOKIE_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes
const COOKIE_MAX_AGE_SECONDS = COOKIE_EXPIRATION_MS / 1000;

/**
 * Sets a pending verification email cookie with a signed payload.
 *
 * @param email - The email address to be verified.
 * @param cookieStore - The cookie store to set the cookie in, typically provided by the request context.
 *
 * The payload includes:
 * - `email`: The email address being verified.
 * - `exp`: The expiration time of the cookie, set to 5 minutes from the current time.
 * - `nonce`: A unique identifier for the request, generated using `crypto.randomUUID()`, to prevent replay attacks.
 *
 * The cookie is signed using a secret defined in the environment variable `COOKIE_SIGNING_SECRET`.
 * If the secret is not set, a warning is logged, and the cookie is not created.
 *
 * The cookie is configured with the following options:
 * - `httpOnly`: Prevents client-side JavaScript from accessing the cookie.
 * - `secure`: Ensures the cookie is sent only over HTTPS in production.
 * - `sameSite`: Set to "lax" to provide some protection against CSRF attacks.
 * - `maxAge`: The cookie will expire after 5 minutes.
 * - `path`: The cookie is available for the "/verify-email" path.
 * 
 * Privacy and security considerations:
 * - The email address is stored in a cookie (server-set, HttpOnly). Although
 *   it is not accessible to client-side scripts, it will be sent with requests
 *   matching the cookie path and may appear in server logs if improperly handled.
 *   Avoid logging cookie values, payloads, or raw emails.
 * - The payload is only integrity-protected (signed), not encrypted. Anyone
 *   with access to the raw cookie value can read the email address. If the email
 *   must be kept confidential from intermediaries or client storage, encrypt
 *   the payload in addition to signing.
 * - Ensure `COOKIE_SIGNING_SECRET` is long, random, and rotated periodically.
 *   If the secret is missing, the cookie is not set, preventing unsigned data
 *   from being stored.
 * - The nonce mitigates replay; verification handlers should also validate
 *   the expiration (`exp`) and match the signature before trusting the payload.
 * - The cookie is short-lived (5 minutes). Keep its scope narrow (`path=/verify-email`)
 *   and avoid widening its path or domain to reduce exposure.
 */
export default function setPendingVerificationEmail(
  email: string | undefined,
  cookieStore: CookieStore
) {
  if (!email) return;

  // Create the payload
  const payload: CookiePayload = {
    email: email,
    exp: Date.now() + COOKIE_EXPIRATION_MS, // 5 minutes
    nonce: crypto.randomUUID(),
  };

  // Sign the payload
  const secret = process.env.COOKIE_SIGNING_SECRET;
  if (secret) {
    const serialized = JSON.stringify(payload);
    const signature = crypto
      .createHmac("sha256", secret)
      .update(serialized)
      .digest("base64url");

    // Combine payload and signature
    const value = `${Buffer.from(serialized).toString(
      "base64url"
    )}.${signature}`;

    // HttpOnly, Secure, short-lived cookie
    try {
      cookieStore.set("pending_verification", value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE_SECONDS, // 5 minutes
        path: "/verify-email",
      });
    } catch (error) {
      console.error("Failed to set pending verification cookie:", error);
    }
  } else {
    console.warn("COOKIE_SIGNING_SECRET is not set; skipping signed cookie.");
  }
}
