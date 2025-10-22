import Footer from "./ui/LandingPage/Footer/Footer";
import Intro from "./ui/LandingPage/Intro/Intro";
import Login from "./ui/LandingPage/Login/Login";
import styles from "./styles.module.css"

export default function LandingPage() {
  return (
    <main className={styles.landingPageContainer}>
      <Intro />
      <Login />
      <Footer />
    </main>
  );
}
