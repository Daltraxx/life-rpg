import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "next/link";
import Link from "next/link";
import styles from "./styles.module.css";
import clsx from "clsx";
import {
  fontSizeToTWMap,
  FontSize,
} from "@/app/ui/utils/helpers/fontSizeToTWMap";
import getSecureRel from "../../utils/helpers/getSecureRel";

/**
 * Color variants for buttons and links with button appearance.
 * Use "custom" with className prop to provide your own color styling.
 */
const buttonColorMap = {
  "brown-600": styles.buttonBrown600,
  "blue-700": styles.buttonBlue700,
  "orange-600": styles.buttonOrange600,
  custom: "",
} satisfies Record<string, string>;

type Color = keyof typeof buttonColorMap;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fontSize?: FontSize;
  color?: Color;
  children: ReactNode;
}

const DEFAULT_COLOR: Color = "brown-600";

/**
 * Renders a styled button element that standardizes color and font sizing via
 * predefined Tailwind class maps.
 *
 * @remarks
 * - Applies base styling from `styles.button`, then augments with `buttonColorMap[color]`
 *   and `fontSizeToTWMap[fontSize]`.
 * - Additional classes can be merged through `className`.
 * - Forwards any extra props (e.g., onClick, disabled, aria-*) to the underlying <button>.
 *
 * @param color - Semantic color key used to select a Tailwind color class. Defaults to `DEFAULT_COLOR`.
 * @param fontSize - Font size key mapped to a Tailwind class (e.g., "20"). Defaults to `"20"`.
 * @param type - HTML button type ("button", "submit", "reset"). Defaults to `"button"`.
 * @param children - Button content, typically text or icons rendered inside the button.
 * @param className - Optional additional class names merged with computed classes.
 * @param restProps - Any other valid button attributes and event handlers forwarded to <button>.
 *
 * @returns A button element with standardized styling and behavior.
 */
export function ButtonWrapper({
  color = DEFAULT_COLOR,
  fontSize = "20",
  type = "button",
  children,
  className,
  ...restProps
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        styles.button,
        buttonColorMap[color],
        fontSizeToTWMap[fontSize],
        className
      )}
      {...restProps}
    >
      {children}
    </button>
  );
}

interface LinkWrapperProps extends LinkProps {
  fontSize?: FontSize;
  color?: Color;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

/**
 * A styled Next.js Link component with consistent button-like appearance.
 * Shares visual styling with ButtonWrapper but renders as a Link for navigation.
 *
 * @param color - The color variant. Defaults to "brown-600".
 * @param fontSize - The font size. Defaults to "20".
 * @param children - The content to display.
 * @param className - Additional CSS classes.
 * @param href - The destination URL (required by Next.js Link).
 * @param restProps - Additional LinkProps to be spread onto the Link.
 *
 * @example
 * ```tsx
 * <LinkWrapper href="/dashboard" color="blue-600" fontSize="16">
 *   Go to Dashboard
 * </LinkWrapper>
 * ```
 */
export function LinkWrapper({
  color = DEFAULT_COLOR,
  fontSize = "20",
  children,
  className,
  target,
  rel,
  ...restProps
}: LinkWrapperProps) {
  const secureRel = getSecureRel(target, rel);
  return (
    <Link
      className={clsx(
        styles.button,
        buttonColorMap[color],
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
