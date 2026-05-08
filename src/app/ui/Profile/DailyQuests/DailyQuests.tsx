import QuestBoard from "@/app/ui/QuestBoard/QuestBoard";
import getQuests from "@/app/queries/server/getQuests";

/**
 * DailyQuests component
 * 
 * Renders the daily quests interface for the user profile.
 * Fetches quests from the server and displays them in a QuestBoard component.
 * 
 * @returns {JSX.Element} A welcome section with the quest board
 */
export default async function DailyQuests() {
  const quests = await getQuests();
  return (
    <div>
      <h1>Welcome, user.</h1>
      <QuestBoard quests={quests}/>
    </div>
  );
}
