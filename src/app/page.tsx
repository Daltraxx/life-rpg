import Intro from "./ui/LandingPage/Intro/Intro";
import styles from "./styles.module.css";

export default function LandingPage() {
  return (
    <div className={styles.landingPageContainer}>
      <Intro />
    </div>
  );
}
