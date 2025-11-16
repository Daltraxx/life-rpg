import Bounded from "../../Bounded";
import Heading from "../../Heading";
import styles from "./styles.module.css";
import { Span } from "../../TextWrappers";
import clsx from "clsx";
import { RegularLinkWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";
import { useMemo } from "react";

export default function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <Bounded
      as="footer"
      outerClassName={styles.boundedContainer}
      innerClassName={styles.contentContainer}
    >
      <div className={styles.brandingContainer}>
        <Heading as="h4" size="72" className={styles.logo}>
          LifeRPG
        </Heading>
        <Span size="20" className={styles.copyright}>
          © {currentYear}
        </Span>
      </div>
      <RegularLinkWrapper
        href="https://www.daltonpettus.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="by Daltraxx INC. (opens in new tab)"
        fontSize="30"
        color="custom"
        className={styles.daltraxxLink}
      >
        by Daltraxx INC.
      </RegularLinkWrapper>
    </Bounded>
  );
}
