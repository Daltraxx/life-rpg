import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import { fontSizeToTWMap, FontSize } from "./utils/fontSizeToTWMap";

interface PProps extends ComponentProps<"p"> {
  size?: FontSize;
  children: ReactNode;
}

export function Paragraph({
  size = "20",
  children,
  className,
  ...restProps
}: PProps) {
  return (
    <p
      className={clsx("font-main", fontSizeToTWMap[size], className)}
      {...restProps}
    >
      {children}
    </p>
  );
}

interface SpanProps extends ComponentProps<"span"> {
  size?: FontSize;
  children: ReactNode;
}

export function Span({
  size = "20",
  children,
  className,
  ...restProps
}: SpanProps) {
  return (
    <span
      className={clsx("font-main", fontSizeToTWMap[size], className)}
      {...restProps}
    >
      {children}
    </span>
  );
}

interface LabelProps extends ComponentProps<"label"> {
  size?: FontSize;
  children: ReactNode;
}

export function Label({
  size = "20",
  children,
  className,
  ...restProps
}: LabelProps) {
  return (
    <label
      className={clsx("font-main", fontSizeToTWMap[size], className)}
      {...restProps}
    >
      {children}
    </label>
  );
}