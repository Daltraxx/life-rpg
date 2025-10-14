import { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type FontSize = "16" | "36" | "48" | "72" | "96" | "manual";

export interface HeadingProps extends ComponentPropsWithoutRef<"h1"> {
  as?: HeadingLevel;
  size?: FontSize;
  children: ReactNode;
}

const fontSizeMap = {
  "16": "text-base",
  "36": "text-4xl",
  "48": "text-5xl",
  "72": "text-7xl",
  "96": "text-8xl",
} as const;

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
        "font-main",
        size !== "manual" && fontSizeMap[size],
        className
      )}
      {...restProps}
    >
      {children}
    </Comp>
  );
}
