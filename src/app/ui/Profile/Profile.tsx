import Bounded from "@/app/ui/JSXWrappers/Bounded";
import DailyQuests from "./DailyQuests/DailyQuests";
import LevelSummary from "./LevelSummary/LevelSummary";
import styles from "./styles.module.css";

export default function Profile() {
  return (
    <>
      <Bounded outerClassName={styles.dailyQuestsContainer}>
        <DailyQuests />
      </Bounded>
      <Bounded outerClassName={styles.levelSummaryContainer}>
        <LevelSummary />
      </Bounded>
    </>
  );
}