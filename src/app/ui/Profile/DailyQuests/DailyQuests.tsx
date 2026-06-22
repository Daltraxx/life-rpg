import QuestBoard from "@/app/ui/QuestBoard/QuestBoard";
import getUsername from "@/app/queries/server/getUsername";
import getDailyQuests from "@/app/queries/server/getDailyQuests";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import styles from "./styles.module.css";

/**
 * Renders the Daily Quests component for a user's profile.
 * 
 * Fetches the user's daily quests and username in parallel, then displays
 * them in a quest board layout with a personalized welcome greeting.
 * 
 * @param {Object} props - Component props
 * @param {string} props.userId - The unique identifier of the user
 * @returns {Promise<JSX.Element>} The rendered Daily Quests component or error state
 * 
 * @remarks
 * This is a server component that uses Promise.all to fetch data concurrently.
 * If either data fetch fails, an error message is displayed to the user.
 * 
 * @todo Implement loading skeleton (possibly in parent component Profile)
 * @todo Implement more fleshed-out error state component (with retry option?)
 */
export default async function DailyQuests({ userId }: { userId: string }) {
  try {
    const [quests, username] = await Promise.all([getDailyQuests(userId), getUsername(userId)]);
    return (
      <div className={styles.container}>
        <Heading as="h1" color="brown-600" size="48-responsive">Welcome, {username || "quester"}.</Heading>
        <QuestBoard quests={quests} userId={userId} />
      </div>
    );
  } catch (error) {
    console.error("Error loading daily quests:", error);
    return (
      <div>
        <Heading as="h1">Oh no.</Heading>
        <p>Sorry, we couldn&apos;t load your quests. Please try again later.</p>
      </div>
    );
  }
}
