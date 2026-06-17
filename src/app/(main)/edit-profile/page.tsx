import { type Metadata } from "next";
import SetupUI from "@/app/ui/profile-editor/SetupUI";
import getQuests from "@/app/queries/server/getQuests";
import getAttributes from "@/app/queries/server/getAttributes";
export const metadata: Metadata = {
  title: "Edit Profile",
  description:
    "Edit your LifeRPG profile, changing your quests and attributes.",
};

export default async function EditProfilePage() {
  const quests = await getQuests();
  const attributes = await getAttributes();
  return (
    <>
      <SetupUI mode="edit" quests={quests} attributes={attributes} />
    </>
  );
}
