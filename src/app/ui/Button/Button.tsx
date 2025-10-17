import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "next/link";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
};

interface LinkWrapperProps extends LinkProps {
  children: ReactNode;
  className?: string;
};


export function Button({
  children,
  className,
    ...restProps
}: ButtonProps) {
  return (
    <button className={className} {...restProps}>
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
    <Link className={className} {...restProps}>
      {children}
    </Link>
  );
}

