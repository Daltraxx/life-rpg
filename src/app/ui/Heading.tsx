import { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import fontSizeToTWMap from "./utils/fontSizeToTWMap";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type FontSize = "16" | "36" | "48" | "72" | "96" | "manual";

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
        "font-main",
        size !== "manual" && fontSizeToTWMap[size],
        className
      )}
      {...restProps}
    >
      {children}
    </Comp>
  );
}
