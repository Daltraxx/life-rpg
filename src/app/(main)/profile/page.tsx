import { type Metadata } from "next";
import Profile from "@/app/ui/Profile/Profile";
export const metadata: Metadata = {
  title: "Profile",
  description:
    "View your LifeRPG profile, view your progress, and manage your quests for the day.",
};

export default function ProfilePage() {
  return <Profile />;
}
