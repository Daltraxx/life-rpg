import clsx from "clsx";
import styles from "./styles.module.css";
import { ChevronUpIcon, ChevronDownIcon } from "@/app/ui/Icons/ChevronIcons";
import { ComponentProps } from "react";

interface ChevronButtonProps extends ComponentProps<"button"> {
  size?: number;
  "aria-label": string;
}

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
      <ChevronUpIcon size={size ? size * 0.9 : undefined} />
    </button>
  );
}

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
      <ChevronDownIcon size={size ? size * 0.9 : undefined} />
    </button>
  );
}
