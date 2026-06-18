import Intro from "@/app/ui/rules-intro/Intro";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SetupUI from "@/app/ui/profile-editor/SetupUI";
import { ROUTES } from "@/utils/constants/routes";
import { Attribute } from "@/utils/types/attribute";

export const metadata: Metadata = {
  title: "Account Setup",
  description:
    "Set up your account to start progressing with Life RPG. Choose the attributes you wish to level, and the daily quests that will get you there.",
};

const INITIAL_ATTRIBUTES: Attribute[] = [
  { id: crypto.randomUUID(), name: "Discipline", experience: 0, level: 1, position: 1 },
  { id: crypto.randomUUID(), name: "Vitality", experience: 0, level: 1, position: 2 },
  { id: crypto.randomUUID(), name: "Intelligence", experience: 0, level: 1, position: 3 },
  { id: crypto.randomUUID(), name: "Fitness", experience: 0, level: 1, position: 4 },
];

export default async function AccountSetupPage() {
  // TODO: add caching for user profile data to limit database requests
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching authenticated user:", error.message);
    redirect(`${ROUTES.ERROR}?reason=auth_error`);
  }
  if (!user) {
    console.warn("No authenticated user found.");
    redirect(`${ROUTES.ERROR}?reason=no_authenticated_user`);
  }

  return (
    <>
      <Intro authUser={user} />
      <SetupUI initialQuests={[]} initialAttributes={INITIAL_ATTRIBUTES} />
    </>
  );
}
