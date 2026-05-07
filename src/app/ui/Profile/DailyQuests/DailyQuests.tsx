import QuestBoard from "@/app/ui/QuestBoard/QuestBoard";
import getQuests from "@/app/queries/server/getQuests";

export default async function DailyQuests() {
  const quests = await getQuests();
  console.log("Fetched quests:", quests);
  return (
    <div>
      <h1>Welcome, user.</h1>
      <QuestBoard quests={quests}/>
    </div>
  );
}
