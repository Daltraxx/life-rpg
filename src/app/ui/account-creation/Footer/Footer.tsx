import Bounded from "@/app/ui/JSXWrappers/Bounded";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import styles from "./styles.module.css";
import { Span } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { BasicLinkWrapper } from "@/app/ui/JSXWrappers/BasicLinkWrapper/BasicLinkWrapper";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
      <BasicLinkWrapper
        href="https://www.daltonpettus.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="by Daltraxx INC. (opens in new tab)"
        fontSize="30"
        color="custom"
        className={styles.daltraxxLink}
      >
        by Daltraxx INC.
      </BasicLinkWrapper>
    </Bounded>
  );
}
