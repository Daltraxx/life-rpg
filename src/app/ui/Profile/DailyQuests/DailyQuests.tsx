import QuestBoard from "@/app/ui/QuestBoard/QuestBoard";
import getQuests from "@/app/queries/server/getQuests";
import getUsername from "@/app/queries/server/getUsername";

/**
 * DailyQuests component
 * 
 * Renders the daily quests interface for the user profile.
 * Fetches quests from the server and displays them in a QuestBoard component.
 * 
 * @returns {JSX.Element} A welcome section with the quest board
 */
export default async function DailyQuests() {
  // TODO: Implement loading and error states for better user experience
  const quests = await getQuests();
  const username = await getUsername();
  return (
    <div>
      <h1>Welcome, {username || "adventurer"}.</h1>
      <QuestBoard quests={quests}/>
    </div>
  );
}
