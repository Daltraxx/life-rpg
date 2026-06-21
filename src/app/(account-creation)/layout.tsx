import { ReactNode } from "react";
import Header from "@/app/ui/layout/unauthenticated/header/Header";
import Footer from "@/app/ui/layout/unauthenticated/footer/Footer";
import styles from "./styles.module.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </>
  );
}
