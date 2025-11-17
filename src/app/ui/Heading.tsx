import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import { fontSizeToTWMap, FontSize } from "./utils/fontSizeToTWMap";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// NOTE: Forwarding refs is no longer necessary in React 19
export interface HeadingProps extends ComponentProps<"h1"> {
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
        fontSizeToTWMap[size],
        className
      )}
      {...restProps}
    >
      {children}
    </Comp>
  );
}
