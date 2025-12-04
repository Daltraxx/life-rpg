import Link, { LinkProps } from "next/link";
import { type FontSize, fontSizeToTWMap } from "@/app/ui/utils/fontSizeToTWMap";
import { type ReactNode } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import getSecureRel from "../../utils/getSecureRel";

const basicLinkColorMap = {
  "brown-600": styles.brown600,
  "blue-700": styles.blue600,
  "orange-300": styles.orange300,
  custom: "",
} satisfies Record<string, string>;

type BasicLinkColor = keyof typeof basicLinkColorMap;

interface BasicLinkWrapperProps extends LinkProps {
  fontSize?: FontSize;
  color?: BasicLinkColor;
  children: ReactNode;
  className?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
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
 *  Use "custom" to skip the built-in color class and provide your own via `className`.
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
  target,
  rel,
  ...restProps
}: BasicLinkWrapperProps) {
  // Ensure that if target is "_blank", rel includes "noopener noreferrer" for security
  const secureRel = getSecureRel(target, rel);

  return (
    <Link
      className={clsx(
        styles.link,
        basicLinkColorMap[color],
        fontSizeToTWMap[fontSize],
        className
      )}
      target={target}
      rel={secureRel}
      {...restProps}
    >
      {children}
    </Link>
  );
}
