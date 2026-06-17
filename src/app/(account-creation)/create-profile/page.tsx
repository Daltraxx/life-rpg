import Intro from "@/app/ui/rules-intro/Intro";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SetupUI from "@/app/ui/profile-editor/SetupUI";
import { ROUTES } from "@/utils/constants/routes";
import { SetupAttribute } from "@/utils/types/accountSetup/SetupAttributesAndQuests";

export const metadata: Metadata = {
  title: "Account Setup",
  description:
    "Set up your account to start progressing with Life RPG. Choose the attributes you wish to level, and the daily quests that will get you there.",
};

const INITIAL_ATTRIBUTES: SetupAttribute[] = [
  { name: "Discipline" },
  { name: "Vitality" },
  { name: "Intelligence" },
  { name: "Fitness" },
];

/**
 * Account setup page component for initial profile creation.
 * 
 * This server component handles the initial account setup flow by:
 * - Authenticating the user with Supabase
 * - Validating user session and redirecting if authentication fails
 * - Rendering the intro and setup UI for profile creation
 * 
 * @returns {JSX.Element} The account setup page with intro and setup UI components
 * 
 * @throws {Error} Redirects to error page if authentication fails or no user is found
 * 
 * @todo Add caching for user profile data to limit database requests
 */
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
      <SetupUI mode="create" quests={[]} attributes={INITIAL_ATTRIBUTES} />
    </>
  );
}
