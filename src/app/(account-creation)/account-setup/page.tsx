import Intro from "@/app/ui/account-creation/AccountSetup/Intro/Intro";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Bounded from '../../ui/JSXWrappers/Bounded';
import AttributeWidget from "@/app/ui/account-creation/AccountSetup/AttributeWidget/AttributeWidget";

export const metadata: Metadata = {
  title: "Account Setup",
  description:
    "Set up your account to start progressing with Life RPG. Choose the attributes you wish to level, and the daily quests that will get you there.",
};
export default async function AccountSetupPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // TODO: Consider removing unrestricted dev access for production
  const isUnrestrictedDevMode =
    process.env.NODE_ENV === "development" &&
    process.env.UNRESTRICTED_DEV_MODE_ACCESS === "true";

  if ((error || !user) && !isUnrestrictedDevMode) {
    if (error) {
      console.error("Error fetching authenticated user:", error);
    } else {
      console.warn("No authenticated user found.");
    }
    redirect("/");
  }

  // Provide mock user for unrestricted dev mode
  const authUser =
    isUnrestrictedDevMode && !user
      ? ({
          id: "2cfd834b-c244-4047-ad88-091b997f26d8",
          email: "dpettus0713@gmail.com",
        } as any)
      : user;

  return (
    <>
      <Intro authUser={authUser} />
      <Bounded>
        <AttributeWidget />
      </Bounded>
    </>
  );}
