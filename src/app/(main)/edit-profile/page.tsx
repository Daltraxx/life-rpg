import { type Metadata } from "next";
import EditUI from "@/app/ui/profile-editor/EditUI";
export const metadata: Metadata = {
  title: "Edit Profile",
  description:
    "Edit your LifeRPG profile, changing your quests and attributes.",
};

export default function EditProfilePage() {
  return (
    <>
      <EditUI />
    </>
  );
}
