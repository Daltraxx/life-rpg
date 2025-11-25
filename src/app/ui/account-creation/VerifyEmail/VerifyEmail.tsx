import styles from "./styles.module.css";

export default function VerifyEmail() {
  return (
    <section role="status" aria-live="polite" className={styles.verifyEmail}>
      <h1>Account Created Successfully!</h1>
      <p>
        Please check your email to verify your account so we can get started.
      </p>
    </section>
  );
}
