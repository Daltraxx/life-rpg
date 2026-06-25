import AttributeSummary from "./AttributeSummary/AttributeSummary";
import Banner from "./Banner/Banner";
import getUserProgress from "@/app/queries/server/getUserProgress";
import styles from "./styles.module.css";
import PurposeStatement from "./PurposeStatement/PurposeStatement";

export default async function LevelSummary({ userId }: { userId: string }) {
  const { data: userProgress, error } = await getUserProgress(userId);
  if (error) {
    console.error("Error fetching user progress:", error);
    // TODO: Handle error more gracefully, maybe with a dedicated error component
    return (
      <div>
        <p>Unable to load your profile information.</p>
        <p>Please refresh the page or contact support if the issue persists.</p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <Banner userProgress={userProgress} />
      <div className={styles.contentContainer}>
        <AttributeSummary
          userProgress={userProgress}
          className={styles.attributeSummary}
        />
        <PurposeStatement
          purposeText={userProgress.purpose}
          className={styles.purposeStatement}
        />
      </div>
    </div>
  );
}
