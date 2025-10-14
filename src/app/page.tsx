import LandingPageIntro from "./ui/LandingPage/LandingPageIntro/LandingPageIntro";
import styles from "./styles.module.css";

export default function LandingPage() {
  return (
    <div className={styles.landingPageContainer}>
      <LandingPageIntro />
    </div>
  );
}
