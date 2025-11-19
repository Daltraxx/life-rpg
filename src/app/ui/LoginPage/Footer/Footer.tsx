import { RegularLinkWrapper } from "../../ButtonLinkWrappers/ButtonLinkWrappers";
import Bounded from "../../Bounded";
import styles from "./styles.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <Bounded as="footer" innerClassName={styles.footer} verticalPadding={false}>
      <RegularLinkWrapper
        href="https://github.com/Daltraxx"
        target="_blank"
        rel="noopener noreferrer"
        fontSize="36"
        color="orange-300"
      >
        © {currentYear} daltraxx INC.
      </RegularLinkWrapper>
    </Bounded>
  );
}
