import AttributeSummary from "./AttributeSummary/AttributeSummary";
import Banner from "./Banner/Banner";
import getUserProgress from "@/app/queries/server/getUserProgress";
import styles from "./styles.module.css";
import PurposeStatement from "./PurposeStatement/PurposeStatement";

export default async function LevelSummary({ userId }: { userId: string }) {
  try {
    const userProgress = await getUserProgress(userId);
    return (
      <div className={styles.container}>
        <Banner userProgress={userProgress} />
        <div>
          <AttributeSummary userProgress={userProgress} />
          <PurposeStatement purposeText={userProgress.purpose} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return (
      <div>
        <p>Error loading user information.</p>
      </div>
    );
  }
}
