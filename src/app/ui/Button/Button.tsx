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

const colorMap = new Map<string, string>([
  ["brown-600", styles.brown600],
  ["blue-600", styles.blue600],
]);

export function Button({
  color = "brown-600",
  children,
  className,
  ...restProps
}: ButtonProps) {
  return (
    <button className={clsx(className, styles.button, colorMap.get(color))} {...restProps}>
      {children}
    </button>
  );
}

export function LinkWrapper({
  color = "brown-600",
  children,
  className,
  ...restProps
}: LinkWrapperProps) {
  return (
    <Link className={clsx(className, styles.button, colorMap.get(color))} {...restProps}>
      {children}
    </Link>
  );
}
