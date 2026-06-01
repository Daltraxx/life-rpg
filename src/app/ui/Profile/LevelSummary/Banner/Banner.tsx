import { UserProgress } from "@/utils/types/UserProgress";
import Avatar from "./Avatar/Avatar";
import LevelProgress from "./LevelProgress/LevelProgress";
import styles from "./styles.module.css";

export default function Banner({ userProgress }: { userProgress: UserProgress }) {
  return (
    <div className={styles.container}>
      <Avatar />
      <LevelProgress userProgress={userProgress} />
    </div>
  );
}