import { ReactNode } from "react";
import Header from "@/app/ui/layout/Header/Header";
import Footer from "@/app/ui/layout/Footer/Footer";
import styles from "./styles.module.css";
import TimezoneUpdater from "../components/TimezoneUpdater";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className={styles.mainContent}>
        <TimezoneUpdater>{children}</TimezoneUpdater>
      </main>
      <Footer />
    </>
  );
}
