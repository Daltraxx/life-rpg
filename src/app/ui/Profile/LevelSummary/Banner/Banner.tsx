import Avatar from "./Avatar/Avatar";
import LevelProgress from "./LevelProgress/LevelProgress";
import styles from "./styles.module.css";

export default function Banner() {
  return (
    <div className={styles.container}>
      <Avatar />
      <LevelProgress />
    </div>
  );
}