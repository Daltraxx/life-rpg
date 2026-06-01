import QuestBoard from "@/app/ui/QuestBoard/QuestBoard";
import getUsername from "@/app/queries/server/getUsername";
import getDailyQuests from "@/app/queries/server/getDailyQuests";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import styles from "./styles.module.css";

/**
 * DailyQuests component
 *
 * Renders the daily quests interface for the user profile.
 * Fetches quests from the server and displays them in a QuestBoard component.
 *
 * @returns {JSX.Element} A welcome section with the quest board
 */
export default async function DailyQuests({ userId }: { userId: string }) {
  // TODO: Implement loading skeleton (possibly in parent component Profile)
  try {
    const [quests, username] = await Promise.all([getDailyQuests(userId), getUsername(userId)]);
    return (
      <div className={styles.container}>
        <Heading as="h1" color="brown-600" size="48-responsive">Welcome, {username || "quester"}.</Heading>
        <QuestBoard quests={quests} />
      </div>
    );
  } catch (error) {
    console.error("Error loading daily quests:", error);
    // TODO: Implement more fleshed-out error state component (with retry option?)
    return (
      <div>
        <Heading as="h1">Oh no.</Heading>
        <p>Sorry, we couldn't load your quests. Please try again later.</p>
      </div>
    );
  }
}
