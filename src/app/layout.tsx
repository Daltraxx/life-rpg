import type { Metadata } from "next";
import { jersey } from "./ui/fonts";
import "./globals.css";
import clsx from "clsx";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Life RPG",
    default: "Life RPG",
  },
  description:
    "Emulate the feeback you get from your favorite games, but for your real life goals.",
  metadataBase: new URL("https://life-rpg.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={clsx(jersey.variable, "antialiased")}>
      <body>
        {children}
      </body>
    </html>
  );
}
