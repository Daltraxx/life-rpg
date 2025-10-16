import { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import fontSizeToTWMap from "./utils/fontSizeToTWMap";

type FontSize = "16" | "20" | "24" | "manual";

type BaseTextProps = {
  size?: FontSize;
  children: ReactNode;
};

export type TextProps =
  | (ComponentPropsWithoutRef<"p"> & BaseTextProps & { as?: "p" })
  | (ComponentPropsWithoutRef<"span"> & BaseTextProps & { as: "span" });

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
