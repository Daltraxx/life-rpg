import Bounded from "../../Bounded";
import Heading from "../../Heading";
import styles from "./styles.module.css";
import Text from "../../Text";
import clsx from "clsx";
import { RegularLinkWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";

export default function Footer() {
  return (
    <Bounded
      as="footer"
      outerClassName={styles.boundedContainer}
      innerClassName={styles.contentContainer}
    >
      <Heading as="h4" size="72" className={styles.branding}>
        LifeRPG
      </Heading>
      <Text
        as="span"
        size="20"
        className={clsx(styles.branding, styles.copyright)}
      >
        © {new Date().getFullYear()}
      </Text>
      <RegularLinkWrapper
        href="https://www.daltonpettus.com/"
        target="_blank"
        rel="noopener noreferrer"
        fontSize="30"
        color="custom"
        className={styles.daltraxxLink}
      >
        by Daltraxx INC.
      </RegularLinkWrapper>
    </Bounded>
  );
}
