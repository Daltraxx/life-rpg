import Bounded from "@/app/ui/JSXWrappers/Bounded";
import Heading from "@/app/ui/JSXWrappers/Heading";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers";
import styles from "./styles.module.css";

export default function VerifyEmail() {
  return (
    <Bounded
      outerClassName={styles.outerContainer}
      innerClassName={styles.contentContainer}
    >
      <section className={styles.verifyEmailSection}>
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
