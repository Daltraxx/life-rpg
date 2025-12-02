import Intro from "@/app/ui/account-creation/AccountSetup/Intro/Intro";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

  if (
    (error || !user) &&
    (process.env.NODE_ENV !== "development" ||
      process.env.UNRESTRICTED_DEV_MODE_ACCESS !== "true")
  ) {
    console.error("Error fetching authenticated user:", error);
    redirect("/");
  }
  return <Intro authUser={user} />;
}
