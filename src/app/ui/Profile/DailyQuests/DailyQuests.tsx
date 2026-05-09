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
  // TODO: Implement loading skeleton (possibly in parent component Profile)
  try {
    const [quests, username] = await Promise.all([getQuests(), getUsername()]);
    return (
      <div>
        <h1>Welcome, {username || "adventurer"}.</h1>
        <QuestBoard quests={quests} />
      </div>
    );
  } catch (error) {
    console.error("Error loading daily quests:", error);
    // TODO: Implement more fleshed-out error state component (with retry option?)
    return (
      <div>
        <h1>Welcome, adventurer.</h1>
        <p>Sorry, we couldn't load your quests. Please try again later.</p>
      </div>
    );
  }
}
