import Intro from "@/app/ui/account-creation/AccountSetup/Intro/Intro";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Account Setup",
  description:
    "Set up your account to start progressing with Life RPG. Choose the attributes you wish to level, and the daily quests that will get you there.",
};
export default async function AccountSetupPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <Intro authUser={user} />;
}
