import Intro from "./ui/LandingPage/Intro/Intro";
import styles from "./styles.module.css";
import Login from "./ui/LandingPage/Login/Login";

export default function LandingPage() {
  return (
    <main className={styles.landingPageContainer}>
      <Intro />
      <Login />
    </main>
  );
}
