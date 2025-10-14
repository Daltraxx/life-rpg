import { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import fontSizeToTWMap from "./utils/fontSizeToTWMap";

type TextType = "p" | "span";
type FontSize = "16" | "20" | "manual";

export interface TextProps extends ComponentPropsWithoutRef<"p"> {
  as?: TextType;
  size?: FontSize;
  children: ReactNode;
}

export default function Text({
  as: Comp = "p",
  size = "20",
  children,
  className,
  ...restProps
}: TextProps) {
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
