import { ReactNode } from "react";
import Header from "@/app/ui/account-creation/Header/Header";
import Footer from "@/app/ui/account-creation/Footer/Footer";
import styles from "./styles.module.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </>
  );
}
