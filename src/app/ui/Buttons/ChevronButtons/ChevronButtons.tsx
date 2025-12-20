import clsx from "clsx";
import styles from "./styles.module.css";
import { ChevronUpIcon, ChevronDownIcon } from "@/app/ui/Icons/ChevronIcons";
import { ComponentProps } from "react";

interface ChevronButtonProps extends ComponentProps<"button"> {
  "aria-label": string;
}

export function ChevronUpButton({ className, ...props }: ChevronButtonProps) {
  return (
    <button type="button" className={clsx(styles.button, className)} {...props}>
      <ChevronUpIcon />
    </button>
  );
}

export function ChevronDownButton({ className, ...props }: ChevronButtonProps) {
  return (
    <button type="button" className={clsx(styles.button, className)} {...props}>
      <ChevronDownIcon />
    </button>
  );
}
