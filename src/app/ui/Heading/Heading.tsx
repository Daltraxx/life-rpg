import { ComponentPropsWithoutRef, ReactNode } from "react";
// import styles from "./styles.module.css";
import clsx from "clsx";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type FontSize = "16" | "36" | "48" | "72" | "manual";

export interface HeadingProps extends ComponentPropsWithoutRef<"h1"> {
  as?: HeadingLevel;
  size?: FontSize;
  children: ReactNode;
}

export default function Heading({
  as: Comp = "h2",
  size = "36",
  children,
  className,
  ...restProps
}: HeadingProps) {
  return (
    <Comp
      className={clsx(
        size === "36" && "text-4xl",
        size === "48" && "text-5xl",
        size === "72" && "text-7xl"
      )}
      {...restProps}
    >
      {children}
    </Comp>
  );
}
