import VerifyEmail from "@/app/ui/account-creation/VerifyEmail/VerifyEmail";

import { type Metadata } from "next";
import { cookies } from "next/headers";
import crypto from "crypto";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email to complete account creation.",
};

export default async function VerifyEmailPage() {
  const cookieStore = await cookies();
  const pendingVerification = cookieStore.get("pending_verification");
  let email = "your email"
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

      // Use payload.uid, payload.nonce, etc.
      console.log(payload);
      email = payload.email;
    } catch (error) {
      console.error("Invalid cookie:", error);
    }
  }

  return <VerifyEmail email={email} />;
}
