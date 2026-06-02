import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import ProgressBar from "./ProgressBar/ProgressBar";
import styles from "./styles.module.css";
import { UserProgress } from "@/utils/types/UserProgress";

export default function LevelProgress({
  userProgress,
}: {
  userProgress: UserProgress;
}) {
  return (
    <div className={styles.container}>
      <Heading color="blue-700" size="48-responsive">
        Level {userProgress.level}
      </Heading>
      <ProgressBar
        start={userProgress.levelStart}
        end={userProgress.levelEnd}
        current={userProgress.experience}
      />
    </div>
  );
}
