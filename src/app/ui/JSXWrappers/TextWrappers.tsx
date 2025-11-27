import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import { fontSizeToTWMap, FontSize } from "@/app/ui/utils/fontSizeToTWMap";

/**
 * A paragraph, span, and label component that renders text with customizable font sizes.
 * 
 * @param props - The component props
 * @param props.size - The font size key from fontSizeToTWMap. Defaults to "20"
 * @param props.children - The content to be rendered inside the label
 * @param props.className - Additional CSS classes to apply to the label
 * @param props.restProps - Any additional HTML label attributes
 * 
 * @returns A styled text element with the specified font size and classes
 * 
 * @example
 * ```tsx
 * <Paragraph size="28" className="text-gray-700">
 *   This is a paragraph.
 * </Paragraph>
 * 
 * <Label size="24" className="text-blue-500">
 *   Username
 * </Label>
 * 
 * <Span size="18" className="italic">
 *   Important Note
 * </Span>
 * ```
 */

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
  htmlFor: string;
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