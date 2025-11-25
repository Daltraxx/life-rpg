import CreateAccountForm from "@/app/ui/account-creation/CreateAccountForm/CreateAccountForm";

import { type Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Improve the sense of feedback and reward you receive from accomplishing your daily goals. Create an account to get started with Life RPG.",
};

export default function CreateAccountPage() {
  return (
      <CreateAccountForm />
  );
}
