import clsx from "clsx";
import styles from "./styles.module.css";
import ChevronUpIcon from "@/app/ui/Icons/ChevronUpIcon";
import ChevronDownIcon from "@/app/ui/Icons/ChevronDownIcon";

interface ChevronButtonProps {
  className?: string;
}

export function ChevronUpButton({ className }: ChevronButtonProps) {
  return (
    <button className={clsx(styles.button, className)}>
      <ChevronUpIcon />
    </button>
  );
}

export function ChevronDownButton({ className }: ChevronButtonProps) {
  return (
    <button className={clsx(styles.button, className)}>
      <ChevronDownIcon />
    </button>
  );
}

