import VerifyEmail from "@/app/ui/account-creation/VerifyEmail/VerifyEmail";

import { type Metadata } from "next";
export const metadata: Metadata = {
  title: "Verify Email",
};

export default function VerifyEmailPage() {
  return <VerifyEmail />;
}