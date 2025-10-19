import { RegularLinkWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";
import Bounded from "../../Bounded";
import styles from "./styles.module.css";

export default function Footer() {
  return (
    <Bounded as="footer" innerClassName={styles.footer} verticalPadding={false}>
      <RegularLinkWrapper
        href="https://www.daltonpettus.com/"
        target="_blank"
        aria-label="Visit creator's website at daltonpettus.com (opens in a new tab)"
        rel="noopener noreferrer"
        fontSize="36"
        color="orange-300"
      >
        by daltraxx INC.
      </RegularLinkWrapper>
    </Bounded>
  );
}
