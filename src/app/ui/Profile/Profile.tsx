import Bounded from "@/app/ui/JSXWrappers/Bounded";
import DailyQuests from "./DailyQuests/DailyQuests";
import LevelSummary from "./LevelSummary/LevelSummary";
import styles from "./styles.module.css";
import getAuthenticatedUserId from "@/app/queries/server/getAuthenticatedUserId";

/**
 * Profile component that displays the user's profile/dashboard 
 * with daily quests and daily experience progress.
 *
 * Retrieves the authenticated user ID and displays their daily quests and level summary.
 * If authentication fails, displays an error message.
 *
 * @returns {Promise<JSX.Element>} The profile UI with daily quests and level summary sections
 */
export default async function Profile() {
  const { data: userId, error } = await getAuthenticatedUserId();
  if (error) {
    // TODO: Handle error more gracefully, maybe with a dedicated error component
    return (
      <div>
        Error loading profile:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
  return (
    <>
      <Bounded outerClassName={styles.dailyQuestsContainer}>
        <DailyQuests userId={userId} />
      </Bounded>
      <Bounded outerClassName={styles.levelSummaryContainer}>
        <LevelSummary userId={userId} />
      </Bounded>
    </>
  );
}
