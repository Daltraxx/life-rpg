import clsx from "clsx";
import styles from "./styles.module.css";
import { ChevronUpIcon, ChevronDownIcon } from "@/app/ui/Icons/ChevronIcons";
import { ComponentProps } from "react";

const ICON_SIZE_RATIO = 0.9;

interface ChevronButtonProps extends ComponentProps<"button"> {
  size?: number;
  "aria-label": string;
}

/**
 * A button component that displays an upward-pointing chevron icon.
 *
 * @param props - The button properties
 * @param props.className - Additional CSS class names to apply to the button
 * @param props.size - The width and height dimensions for the button and icon (icon will be 90% of button size)
 * @param props....props - Additional HTML button attributes
 *
 * @returns A button element containing a ChevronUpIcon
 *
 * @example
 * ```tsx
 * <ChevronUpButton size={32} onClick={handleClick} aria-label="Scroll up" />
 * ```
 */
export function ChevronUpButton({
  className,
  size,
  ...props
}: ChevronButtonProps) {
  return (
    <button
      type="button"
      className={clsx(styles.button, className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <ChevronUpIcon size={size ? size * ICON_SIZE_RATIO : undefined} />
    </button>
  );
}

/**
 * A button component that displays a downward-pointing chevron icon.
 *
 * @param props - The button properties
 * @param props.className - Optional CSS class name(s) to apply to the button
 * @param props.size - Optional size (in pixels) for both width and height of the button. The chevron icon will be 90% of this size
 * @param props....props - Additional HTML button attributes
 *
 * @returns A button element containing a chevron down icon
 *
 * @example
 * ```tsx
 * <ChevronDownButton size={32} onClick={handleClick} aria-label="Scroll down" />
 * ```
 */
export function ChevronDownButton({
  className,
  size,
  ...props
}: ChevronButtonProps) {
  return (
    <button
      type="button"
      className={clsx(styles.button, className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <ChevronDownIcon size={size ? size * ICON_SIZE_RATIO : undefined} />
    </button>
  );
}
