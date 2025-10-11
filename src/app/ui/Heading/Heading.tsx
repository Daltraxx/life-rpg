import { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./styles.module.css";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type FontSize = "xs" | "sm" | "md" | "lg" | "xl" | "manual";

export interface HeadingProps extends ComponentPropsWithoutRef<"h1"> {
  as?: HeadingLevel;
  size?: FontSize;
  children: ReactNode;
}

export default function Heading({
  as: Comp = "h2",
  size = "lg",
  children,
  className,
  ...restProps
}: HeadingProps) {
  return <Comp {...restProps}>{children}</Comp>;
}
