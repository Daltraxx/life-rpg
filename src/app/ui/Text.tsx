import { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import { fontSizeToTWMap, FontSize } from "./utils/fontSizeToTWMap";

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
        fontSizeToTWMap[size],
        className
      )}
      {...restProps}
    >
      {children}
    </Comp>
  );
}
