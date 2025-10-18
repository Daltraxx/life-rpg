import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "next/link";
import Link from "next/link";
import styles from "./styles.module.css";
import clsx from "clsx";

type Color = "brown-600" | "blue-600";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: Color;
  children: ReactNode;
}

interface LinkWrapperProps extends LinkProps {
  color?: Color;
  children: ReactNode;
  className?: string;
}

const buttonColorMap = {
  "brown-600": styles.buttonBrown600,
  "blue-600": styles.buttonBlue600,
} satisfies Record<Color, string>;

const DEFAULT_COLOR: Color = "brown-600";

export function ButtonWrapper({
  color = DEFAULT_COLOR,
  children,
  className,
  ...restProps
}: ButtonProps) {
  return (
    <button
      className={clsx(className, styles.button, buttonColorMap[color])}
      {...restProps}
    >
      {children}
    </button>
  );
}

export function LinkWrapper({
  color = DEFAULT_COLOR,
  children,
  className,
  ...restProps
}: LinkWrapperProps) {
  return (
    <Link
      className={clsx(className, styles.button, buttonColorMap[color])}
      {...restProps}
    >
      {children}
    </Link>
  );
}

export function LinkNoStyleWrapper({
  color = DEFAULT_COLOR,
  children,
  className,
  ...restProps
}: LinkWrapperProps) {
  return (
    <Link className={clsx(className)} {...restProps}>
      {children}
    </Link>
  );
}
