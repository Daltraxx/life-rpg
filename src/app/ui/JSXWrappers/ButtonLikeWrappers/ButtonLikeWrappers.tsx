import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "next/link";
import Link from "next/link";
import styles from "./styles.module.css";
import clsx from "clsx";
import { fontSizeToTWMap, FontSize } from "@/app/ui/utils/fontSizeToTWMap";

/**
 * Color variants for buttons and links with button appearance.
 * Use "custom" with className prop to provide your own color styling.
 */
const buttonColorMap = {
  "brown-600": styles.buttonBrown600,
  "blue-600": styles.buttonBlue600,
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
 * A styled wrapper component that provides consistent visual appearance for interactive elements.
 * This component can be used to wrap either button elements (via ButtonWrapper) or Next.js Link components (via LinkWrapper).
 * Both wrappers share the same visual styling but differ in their underlying HTML element and behavior.
 *
 * @param color - The color variant of the button/link. Defaults to DEFAULT_COLOR.
 * @param fontSize - The font size of the button/link text. Defaults to "20".
 * @param children - The content to be displayed inside the button/link.
 * @param className - Additional CSS classes to apply to the component.
 * @param restProps - Additional props to be spread onto the underlying element.
 *
 * @example
 * ```tsx
 * // As a button
 * <ButtonWrapper color="brown-600" fontSize="16">
 *   Click me
 * </ButtonWrapper>
 *
 * // As a link
 * <LinkWrapper color="brown-600" fontSize="16" href="/dashboard">
 *   Go to Dashboard
 * </LinkWrapper>
 * ```
 */
export function ButtonWrapper({
  color = DEFAULT_COLOR,
  fontSize = "20",
  children,
  className,
  ...restProps
}: ButtonProps) {
  return (
    <button
      type="button"
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

export function LinkWrapper({
  color = DEFAULT_COLOR,
  fontSize = "20",
  children,
  className,
  ...restProps
}: LinkWrapperProps) {
  return (
    <Link
      className={clsx(
        styles.button,
        buttonColorMap[color],
        fontSizeToTWMap[fontSize],
        className
      )}
      {...restProps}
    >
      {children}
    </Link>
  );
}
