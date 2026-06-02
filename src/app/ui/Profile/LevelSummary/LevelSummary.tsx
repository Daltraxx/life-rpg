import AttributeSummary from "./AttributeSummary/AttributeSummary";
import Banner from "./Banner/Banner";
import getUserProgress from "@/app/queries/server/getUserProgress";
import styles from "./styles.module.css";

export default async function LevelSummary({ userId }: { userId: string }) {
  try {
    const userProgress = await getUserProgress(userId);
    return (
      <div className={styles.container}>
        <Banner userProgress={userProgress} />
        <AttributeSummary userProgress={userProgress} />
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
