import { RegularLinkWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";
import Bounded from "../../Bounded";
import styles from "./styles.module.css";

export default function Footer() {
  return (
    <Bounded as="footer" innerClassName={styles.footer} verticalPadding={false}>
      <RegularLinkWrapper
        href="https://www.daltonpettus.com/"
        target="_blank"
        rel="noopener noreferrer"
        fontSize="36"
        color="orange-300"
      >
        © {new Date().getFullYear()} daltraxx INC.
      </RegularLinkWrapper>
    </Bounded>
  );
}
