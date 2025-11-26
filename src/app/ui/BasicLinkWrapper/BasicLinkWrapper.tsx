import { LinkProps } from "next/link";
import { FontSize } from "../utils/fontSizeToTWMap";
import Link from "next/link";
import { type ReactNode } from "react";
import { fontSizeToTWMap } from "../utils/fontSizeToTWMap";
import clsx from "clsx";
import styles from "./styles.module.css";

const basicLinkColorMap = {
  "brown-600": styles.brown600,
  "blue-600": styles.blue600,
  "orange-300": styles.orange300,
  custom: "",
} satisfies Record<string, string>;

type BasicLinkColor = keyof typeof basicLinkColorMap;

interface BasicLinkWrapperProps extends LinkProps {
  fontSize?: FontSize;
  color?: BasicLinkColor;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

const DEFAULT_COLOR: BasicLinkColor = "brown-600";

/**
 * Renders a Next.js `Link` styled as a regular text link with color and font-size utilities applied.
 *
 * Uses `clsx` to merge:
 * - a base style for regular links,
 * - a color class from `basicLinkColorMap` based on `color`,
 * - a font-size utility from `fontSizeToTWMap` based on `fontSize`,
 * - any additional classes passed via `className`.
 *
 * @remarks
 * - Intended for inline textual navigation links (not primary buttons).
 * - `fontSize` maps to predefined Tailwind utility classes; values outside the map may result in missing styles.
 * - Additional `Link` props can be passed through `restProps` (e.g., `href`, `prefetch`, `replace`).
 *
 * @param color - Visual theme key selecting the link color; defaults to `DEFAULT_COLOR`.
 * @param fontSize - Font size key mapped to Tailwind classes; defaults to `"16"`.
 * @param children - React nodes rendered inside the link.
 * @param className - Optional additional class names to append to computed styles.
 * @param restProps - Additional Next.js `Link` props forwarded to the underlying component.
 *
 * @returns A styled Next.js `Link` element wrapping the provided `children`.
 */
export function BasicLinkWrapper({
  color = DEFAULT_COLOR,
  fontSize = "16",
  children,
  className,
  ...restProps
}: BasicLinkWrapperProps) {
  return (
    <Link
      className={clsx(
        styles.link,
        basicLinkColorMap[color],
        fontSizeToTWMap[fontSize],
        className
      )}
      {...restProps}
    >
      {children}
    </Link>
  );
}
