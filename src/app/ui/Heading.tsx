import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import { fontSizeToTWMap, FontSize } from "./utils/fontSizeToTWMap";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// NOTE: Forwarding refs is no longer necessary in React 19
export interface HeadingProps extends ComponentProps<HeadingLevel> {
  as?: HeadingLevel;
  size?: FontSize;
  children: ReactNode;
}

/**
 * A flexible heading component that renders semantic HTML heading elements with customizable styling.
 * 
 * @param props - The component props
 * @param props.as - The HTML heading element to render (h1-h6). Defaults to "h2"
 * @param props.size - The font size from the predefined size map. Defaults to "36"
 * @param props.children - The content to be rendered inside the heading
 * @param props.className - Additional CSS classes to apply to the heading
 * @param props.restProps - Any additional HTML attributes to spread onto the heading element
 * 
 * @returns A rendered heading element with applied styles and content
 * 
 * @example
 * ```tsx
 * <Heading as="h1" size="48" className="text-blue-500">
 *   Welcome to Life RPG
 * </Heading>
 * ```
 */
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
