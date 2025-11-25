import Bounded from "../../Bounded";
import Heading from "../../Heading";
import { Paragraph } from "../../TextWrappers";
import styles from "./styles.module.css";

export default function VerifyEmail() {
  return (
    <Bounded innerClassName={styles.contentContainer}>
      <section role="status" aria-live="polite" className={styles.verifyEmailSection}>
        <Heading as="h1" size="48-responsive">
          Account Created Successfully!
        </Heading>
        <Paragraph size="36-responsive">
          Please check your email to verify your account so we can get started.
        </Paragraph>
      </section>
    </Bounded>
  );
}
