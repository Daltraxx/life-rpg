import VerifyEmail from "@/app/ui/account-creation/VerifyEmail/VerifyEmail";

import { type Metadata } from "next";
export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email to complete account creation.",
};

export default function VerifyEmailPage() {
  return <VerifyEmail />;
}