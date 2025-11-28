import VerifyEmail from "@/app/ui/account-creation/VerifyEmail/VerifyEmail";

import { type Metadata } from "next";
import { cookies } from "next/headers";
import crypto from "crypto";
import { get } from "http";
import getPendingVerificationEmail from "@/utils/cookies/getPendingVerificationEmail";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email to complete account creation.",
};

export default async function VerifyEmailPage() {
  // TODO: add loading state while verifying cookie
  const cookieStore = await cookies();
  const email = getPendingVerificationEmail("your email", cookieStore);

  return <VerifyEmail email={email} />;
}
