import Bounded from "@/app/ui/JSXWrappers/Bounded";
import DailyQuests from "./DailyQuests/DailyQuests";
import LevelSummary from "./LevelSummary/LevelSummary";
import styles from "./styles.module.css";
import getAuthenticatedUserId from "@/app/queries/server/getAuthenticatedUserId";

export default async function Profile() {
  try {
    const userId = await getAuthenticatedUserId();
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
  } catch (error) {
    // TODO: Handle error more gracefully, maybe with a dedicated error component
    return (
      <div>
        Error loading profile:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
}
