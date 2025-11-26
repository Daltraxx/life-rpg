import { BasicLinkWrapper } from "@/app/ui/BasicLinkWrapper/BasicLinkWrapper";
import Bounded from "../../Bounded";
import styles from "./styles.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Bounded as="footer" innerClassName={styles.footer} verticalPadding={false}>
      <BasicLinkWrapper
        href="https://github.com/Daltraxx"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit daltraxx INC. on GitHub (opens in new tab)"
        fontSize="36"
        color="orange-300"
      >
        © {currentYear} daltraxx INC.
      </BasicLinkWrapper>
    </Bounded>
  );
}
