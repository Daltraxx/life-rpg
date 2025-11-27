import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import { fontSizeToTWMap, FontSize } from "@/app/ui/utils/fontSizeToTWMap";

/**
 * A paragraph component that wraps text content with customizable font size.
 * 
 * @param props - The component props
 * @param props.size - The font size preset. Defaults to "20". Must be a valid key in fontSizeToTWMap.
 * @param props.children - The text content to be rendered inside the paragraph
 * @param props.className - Additional CSS classes to apply to the paragraph element
 * @param props.restProps - Any additional HTML paragraph element attributes
 * 
 * @returns A styled paragraph element with the main font family and specified font size
 * 
 * @example
 * ```tsx
 * <Paragraph size="24" className="text-blue-500">
 *   This is a paragraph with size 24
 * </Paragraph>
 * ```
 */
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

interface PProps extends ComponentProps<"p"> {
  size?: FontSize;
  children: ReactNode;
}

/**
 * A wrapper component for the HTML span element with customizable font size.
 * 
 * @param props - The component props
 * @param props.size - The font size key that maps to Tailwind CSS classes. Defaults to "20"
 * @param props.children - The content to be rendered inside the span element
 * @param props.className - Additional CSS classes to apply to the span element
 * @param props.restProps - Any additional HTML span attributes
 * 
 * @returns A styled span element with the main font and specified font size
 * 
 * @example
 * ```tsx
 * <Span size="16" className="text-blue-500">
 *   Hello World
 * </Span>
 * ```
 */
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

interface SpanProps extends ComponentProps<"span"> {
  size?: FontSize;
  children: ReactNode;
}

/**
 * A customizable label component with configurable font size.
 *
 * @param props - The component props
 * @param props.size - The font size from predefined sizes. Defaults to "20"
 * @param props.children - The content to be rendered inside the label
 * @param props.className - Additional CSS classes to apply to the label
 * @param props.restProps - Any additional HTML label attributes
 *
 * @returns A styled label element with the specified properties
 *
 * @example
 * ```tsx
 * <Label size="24" className="custom-class">
 *   Username
 * </Label>
 * ```
 */
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

interface LabelProps extends ComponentProps<"label"> {
  htmlFor: string;
  size?: FontSize;
  children: ReactNode;
}
