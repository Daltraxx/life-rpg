import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import crypto from "crypto";

export default function getPendingVerificationEmail(
  fallback: string,
  cookieStore: ReadonlyRequestCookies
): string {
  let email = fallback;
  const pendingVerification = cookieStore.get("pending_verification");
  if (pendingVerification) {
    try {
      const [payloadB64, signature] = pendingVerification.value.split(".");

      // Verify signature
      const secret = process.env.COOKIE_SIGNING_SECRET;
      if (!secret) throw new Error("Missing secret");

      const serialized = Buffer.from(payloadB64, "base64url").toString();
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(serialized)
        .digest("base64url");

      if (signature !== expectedSignature) {
        throw new Error("Invalid signature");
      }

      const payload = JSON.parse(serialized);

      // Check expiration
      if (Date.now() > payload.exp) {
        throw new Error("Cookie expired");
      }
      email = payload.email;
    } catch (error) {
      console.error("Invalid cookie:", error);
    }
  }
  return email;
}
