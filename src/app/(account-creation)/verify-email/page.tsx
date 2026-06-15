import VerifyEmail from "@/app/ui/account-creation/VerifyEmail/VerifyEmail";

import { type Metadata } from "next";
import { cookies } from "next/headers";
import getPendingVerificationEmailCookie from "@/utils/cookies/getPendingVerificationEmailCookie";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email to complete account creation.",
};

export default async function VerifyEmailPage() {
  // TODO: add loading state while verifying cookie
  const cookieStore = await cookies();
  // Get user's email pending verification from cookie or placeholder text in case of failure
  const email = getPendingVerificationEmailCookie(cookieStore, "your email");

  return <VerifyEmail email={email} />;
}
