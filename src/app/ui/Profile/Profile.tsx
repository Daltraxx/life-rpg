import Bounded from "@/app/ui/JSXWrappers/Bounded";
import DailyQuests from "./DailyQuests/DailyQuests";

export default function Profile() {
  return (
    <Bounded>
      <div>Profile Page</div>
      <DailyQuests />
    </Bounded>
  );
}