import { ComponentProps } from "react";
import clsx from "clsx";
import { fontSizeToTWMap, FontSize } from "@/utils/helpers/fontSizeToTWMap";
import styles from "./styles.module.css";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const headingColorMap = {
  background: styles.textBackground,
  "blue-700": styles.textBlue700,
} satisfies Record<string, string>;

export type HeadingColor = keyof typeof headingColorMap;

// NOTE: Forwarding refs is no longer necessary in React 19
export interface HeadingProps extends ComponentProps<"h2"> {
  as?: HeadingLevel;
  size?: FontSize;
  color?: HeadingColor;
}

const DEFAULT_SIZE: FontSize = "36";

/**
 * A flexible heading component that renders semantic HTML heading elements with customizable styling.
 *
 * @param props - The component props
 * @param props.as - The HTML heading element to render (h1–h6). Defaults to `"h2"`.
 * @param props.size - The font size from the predefined size map. Defaults to `"36"`.
 * @param props.color - Optional predefined heading color key (e.g., `"blue-700"`). If omitted, no color class is applied.
 * @param props.children - The content to be rendered inside the heading.
 * @param props.className - Additional CSS classes to apply to the heading.
 *
 * @returns A rendered heading element with applied styles and content.
 *
 * @example
 * ```tsx
 * <Heading as="h1" size="48" color="blue-700" className="my-4">
 *   Welcome to Life RPG
 * </Heading>
 * ```
 */
export default function Heading({
  as: Comp = "h2",
  size = DEFAULT_SIZE,
  color,
  children,
  className,
  ...restProps
}: HeadingProps) {
  return (
    <Comp
      className={clsx(
        "font-main",
        fontSizeToTWMap[size],
        color && headingColorMap[color],
        className
      )}
      {...restProps}
    >
      {children}
    </Comp>
  );
}
