import Footer from "./ui/LoginPage/Footer/Footer";
import Intro from "./ui/LoginPage/Intro/Intro";
import LoginForm from "./ui/LoginPage/LoginForm/LoginForm";
import styles from "./styles.module.css";

export default function LoginPage() {
  return (
    <main className={styles.loginPageContainer}>
      <Intro />
      <LoginForm />
      <Footer />
    </main>
  );
}
