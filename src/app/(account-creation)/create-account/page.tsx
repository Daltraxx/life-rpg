import CreateAccountForm from "@/app/ui/account-creation/CreateAccountForm/CreateAccountForm";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Account",
};

export default function CreateAccountPage() {
  return (
    <main>
      <CreateAccountForm />
    </main>
  );
}
