import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "next/link";
import Link from "next/link";
import styles from "./styles.module.css";
import clsx from "clsx";
import { fontSizeToTWMap, FontSize } from "@/app/ui/utils/fontSizeToTWMap";

type Color = "brown-600" | "blue-600" | "orange-300";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fontSize?: FontSize;
  color?: Color;
  children: ReactNode;
}

interface LinkWrapperProps extends LinkProps {
  fontSize?: FontSize;
  color?: Color;
  children: ReactNode;
  className?: string;
  target?: string;
}

const buttonColorMap = {
  "brown-600": styles.buttonBrown600,
  "blue-600": styles.buttonBlue600,
  "orange-300": styles.buttonOrange300,
} satisfies Record<Color, string>;

const DEFAULT_COLOR: Color = "brown-600";

export function ButtonWrapper({
  color = DEFAULT_COLOR,
  fontSize = "20",
  children,
  className,
  ...restProps
}: ButtonProps) {
  return (
    <button
      className={clsx(styles.button, buttonColorMap[color], fontSizeToTWMap[fontSize], className)}
      {...restProps}
    >
      {children}
    </button>
  );
}

export function LinkWrapper({
  color = DEFAULT_COLOR,
  fontSize = "20",
  children,
  className,
  ...restProps
}: LinkWrapperProps) {
  return (
    <Link
      className={clsx(styles.button, buttonColorMap[color], fontSizeToTWMap[fontSize], className)}
      {...restProps}
    >
      {children}
    </Link>
  );
}

const linkColorMap = {
  "brown-600": styles.regularLinkBrown600,
  "blue-600": styles.regularLinkBlue600,
  "orange-300": styles.regularLinkOrange300,
} satisfies Record<Color, string>;

export function RegularLinkWrapper({
  color = DEFAULT_COLOR,
  fontSize = "16",
  children,
  className,
  ...restProps
}: LinkWrapperProps) {
  return (
    <Link className={clsx(styles.regularLink, linkColorMap[color], fontSizeToTWMap[fontSize], className)} {...restProps}>
      {children}
    </Link>
  );
}
