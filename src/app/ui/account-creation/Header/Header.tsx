import Link from "next/link";
import Bounded from "@/app/ui/JSXWrappers/Bounded";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import styles from "./styles.module.css";
import { JSX } from "react";
import { Button } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";

export default function Header(): JSX.Element {
  return (
    <Bounded
      as="header"
      outerClassName={styles.boundedContainer}
      innerClassName={styles.contentContainer}
    >
      <Button className={styles.menuButton} size="30">MENU</Button>
      <Link href="/" className={styles.brandingLink}>
        <Heading as="h2" size="72" className={styles.branding}>
          LifeRPG
        </Heading>
      </Link>
    </Bounded>
  );
}
