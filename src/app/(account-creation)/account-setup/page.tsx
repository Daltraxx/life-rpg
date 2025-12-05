import Intro from "@/app/ui/account-creation/AccountSetup/Intro/Intro";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Bounded from "@/app/ui/JSXWrappers/Bounded";
import AttributeWidget from "@/app/ui/account-creation/AccountSetup/AttributeWidget/AttributeWidget";

export const metadata: Metadata = {
  title: "Account Setup",
  description:
    "Set up your account to start progressing with Life RPG. Choose the attributes you wish to level, and the daily quests that will get you there.",
};
export default async function AccountSetupPage() {
  // TODO: add caching for user profile data to limit database requests
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    if (error) {
      console.error("Error fetching authenticated user:", error);
    } else {
      console.warn("No authenticated user found.");
    }
    redirect("/");
  }

  return (
    <>
      <Intro authUser={user} />
      <Bounded>
        <AttributeWidget />
      </Bounded>
    </>
  );
}
