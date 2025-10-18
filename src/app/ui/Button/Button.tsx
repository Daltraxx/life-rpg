import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "next/link";
import Link from "next/link";
import styles from "./styles.module.css";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

interface LinkWrapperProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

export function Button({ children, className, ...restProps }: ButtonProps) {
  return (
    <button className={clsx(className, styles.button)} {...restProps}>
      {children}
    </button>
  );
}

export function LinkWrapper({
  children,
  className,
  ...restProps
}: LinkWrapperProps) {
  return (
    <Link className={clsx(className, styles.button)} {...restProps}>
      {children}
    </Link>
  );
}
