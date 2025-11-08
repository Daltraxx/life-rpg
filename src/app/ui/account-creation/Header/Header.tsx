import Link from "next/link";
import Bounded from "../../Bounded";
import Heading from "../../Heading";
import styles from "./styles.module.css";

export default function Header() {
  return (
    <Bounded
      as="header"
      outerClassName={styles.boundedContainer}
      innerClassName={styles.contentContainer}
    >
      <Link
        href="/"
        className={styles.brandingLink}
        aria-label="Go to homepage"
      >
        <Heading as="h2" size="72" className={styles.branding}>
          LifeRPG
        </Heading>
      </Link>
    </Bounded>
  );
}
