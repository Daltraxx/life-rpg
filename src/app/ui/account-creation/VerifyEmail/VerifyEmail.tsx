import Bounded from "@/app/ui/JSXWrappers/Bounded";
import Heading from "@/app/ui/JSXWrappers/Heading";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers";
import styles from "./styles.module.css";

export default function VerifyEmail() {
  // TODO:
  // Display the email address where the verification was sent
  // A "Resend verification email" button in case they don't receive it
  // A link to navigate back to login or home page
  // Additional guidance on what to do if the email doesn't arrive (e.g., check spam folder)
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
