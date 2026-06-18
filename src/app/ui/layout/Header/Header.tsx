import Link from "next/link";
import Bounded from "@/app/ui/JSXWrappers/Bounded";
import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import styles from "./styles.module.css";
import { JSX } from "react";
import OptionsMenu from "./OptionsMenu/OptionsMenu";
import { ROUTES } from "@/utils/constants/routes";
import { getProfileComplete } from "./helpers/get-profile-complete";

export default async function Header(): Promise<JSX.Element> {
  try {
    const profileComplete = await getProfileComplete();
    return (
      <Bounded
        as="header"
        outerClassName={styles.boundedContainer}
        innerClassName={styles.contentContainer}
      >
        <Link href={ROUTES.HOME} className={styles.brandingLink}>
          <Heading as="h2" size="72" className={styles.branding}>
            LifeRPG
          </Heading>
        </Link>
        <OptionsMenu
          className={styles.options}
          profileComplete={profileComplete}
        />
      </Bounded>
    );
  } catch (error) {
    console.error("Error rendering header:", { error });
    // TODO: create error page and route, then redirect to it here instead of rendering fallback UI
    return (
      <Bounded
        as="header"
        outerClassName={styles.boundedContainer}
        innerClassName={styles.contentContainer}
      >
        <Link href={ROUTES.HOME} className={styles.brandingLink}>
          <Heading as="h2" size="72" className={styles.branding}>
            LifeRPG
          </Heading>
        </Link>
      </Bounded>
    );
  }
}
