import Bounded from "@/app/ui/JSXWrappers/Bounded";
import Heading from "@/app/ui/JSXWrappers/Heading";
import { Paragraph } from "@/app/ui/JSXWrappers/TextWrappers";
import styles from "./styles.module.css";

const PLACEHOLDER_EMAIL = "your email";
export default function VerifyEmail({ email }: { email: string }) {
  // TODO:
  // A "Resend verification email" button in case they don't receive it
  // A link to navigate back to login or home page
  // Additional guidance on what to do if the email doesn't arrive (e.g., check spam folder)
  
  email = email?.trim() || PLACEHOLDER_EMAIL;

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
          Please check <strong>{email}</strong> to verify your account so we can
          get started.
        </Paragraph>
      </section>
    </Bounded>
  );
}
