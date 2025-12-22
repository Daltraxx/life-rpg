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
 * A button component that renders with a chevron icon.
 *
 * @param props - The button properties
 * @param props.className - Optional CSS class name to apply to the button
 * @param props.size - Optional size in pixels for both width and height of the button
 * @param props.icon - A React functional component that accepts a size prop and renders an icon
 * @param props....props - Additional HTML button attributes from ChevronButtonProps
 *
 * @returns A styled button element containing the specified icon, scaled proportionally to the button size
 *
 * @example
 * ```tsx
 * <ChevronButton
 *   icon={ChevronUpIcon}
 *   size={48}
 *   onClick={handleClick}
 * />
 * ```
 */
function ChevronButton({
  className,
  size,
  icon: Icon,
  ...props
}: ChevronButtonProps & { icon: React.FC<{ size?: number }> }) {
  return (
    <button
      type="button"
      className={clsx(styles.button, className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <Icon size={size ? size * ICON_SIZE_RATIO : undefined} />
    </button>
  );
}

/**
 * A button component that displays an upward-pointing chevron icon.
 *
 * @param props - The chevron button properties
 * @param props.size - Optional size in pixels for both width and height of the button. Icon scales proportionally.
 * @param props["aria-label"] - Accessible label for screen readers (required)
 * @param props....props - Additional HTML button attributes
 * @returns A ChevronButton component configured with an upward chevron icon
 *
 * @example
 * ```tsx
 * <ChevronUpButton
 *   aria-label="Scroll up"
 *   size={48}
 *   onClick={() => console.log('Up clicked')}
 * />
 * ```
 */
export function ChevronUpButton(props: ChevronButtonProps) {
  return <ChevronButton icon={ChevronUpIcon} {...props} />;
}

/**
 * A button component that displays a downward-pointing chevron icon.
 *
 * @param props - The chevron button properties
 * @param props.size - Optional size in pixels for both width and height of the button. Icon scales proportionally.
 * @param props["aria-label"] - Accessible label for screen readers (required)
 * @param props....props - Additional HTML button attributes
 * @returns A ChevronButton component configured with a downward chevron icon
 *
 * @example
 * ```tsx
 * <ChevronDownButton
 *   aria-label="Scroll down"
 *   size={48}
 *   onClick={() => console.log('Down clicked')}
 * />
 * ```
 */
export function ChevronDownButton(props: ChevronButtonProps) {
  return <ChevronButton icon={ChevronDownIcon} {...props} />;
}
