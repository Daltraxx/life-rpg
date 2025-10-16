import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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

