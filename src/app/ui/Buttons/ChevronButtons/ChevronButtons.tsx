import clsx from "clsx";
import styles from "./styles.module.css";
import { ChevronUpIcon, ChevronDownIcon } from "@/app/ui/Icons/ChevronIcons";
import { ComponentProps } from "react";

const ICON_SIZE_RATIO = 0.9;

const backgroundColorStyleMap: Record<string, string> = {
  "none": "",
  "gray-200": styles.gray200Background,
};

const iconColorStyleMap: Record<string, string> = {
  "brown-600": styles.brown600Fill,
  "blue-700": styles.blue700Fill,
};

interface ChevronButtonProps extends ComponentProps<"button"> {
  size?: number;
  iconColor?: keyof typeof iconColorStyleMap;
  backgroundColor?: keyof typeof backgroundColorStyleMap;
  "aria-label": string;
}

/**
 * A button component that renders with a chevron icon.
 *
 * @param props - The button properties
 * @param props.className - Optional CSS class name to apply to the button
 * @param props.size - Optional size in pixels for both width and height of the button
 * @param props.icon - A React functional component that accepts a size prop and renders an icon
 * @param props.iconColor - Optional color key for the icon from the colorStyleMap
 * @param props.backgroundColor - Optional background color key from the backgroundColorStyleMap
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
  iconColor = "brown-600",
  backgroundColor = "gray-200",
  ...props
}: ChevronButtonProps & { icon: React.FC<{ size?: number }> }) {
  return (
    <button
      type="button"
      className={clsx(
        styles.button,
        backgroundColorStyleMap[backgroundColor],
        iconColorStyleMap[iconColor],
        className,
      )}
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
