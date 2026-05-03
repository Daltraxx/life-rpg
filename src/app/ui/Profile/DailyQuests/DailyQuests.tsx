import QuestBoard from "@/app/ui/QuestBoard/QuestBoard";

export default function DailyQuests() {
  return (
    <div>
      <h1>Welcome, user.</h1>
      <QuestBoard quests={[]}/>
    </div>
  );
}
