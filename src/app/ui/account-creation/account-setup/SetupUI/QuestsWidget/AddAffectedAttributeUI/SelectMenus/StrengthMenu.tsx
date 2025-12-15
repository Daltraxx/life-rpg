"use client";

import styles from "./styles.module.css";
import clsx from "clsx";
import { strengthDisplayMap } from "@/app/ui/utils/helpers/StrengthDisplayMap";
import type { AttributeStrength } from "@/app/ui/utils/types/AttributeStrength";
import { Select } from "radix-ui";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@radix-ui/react-icons";

interface AttributeOptionProps
  extends React.ComponentProps<typeof Select.Item> {
  className?: string;
}

const AttributeOption = ({
  children,
  className,
  value,
  ...props
}: AttributeOptionProps) => {
  return (
    <Select.Item
      className={clsx(styles.item, className)}
      value={value}
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className={styles.itemIndicator}>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
};

const AttributeOptions = Object.keys(strengthDisplayMap).map((strengthKey) => (
  <AttributeOption key={strengthKey} value={strengthKey}>
    {strengthDisplayMap[strengthKey as AttributeStrength]}
  </AttributeOption>
));

const PLUS_STRENGTHS: Set<AttributeStrength> = new Set(["plus", "plusPlus"]);

interface StrengthMenuProps {
  currentStrength: AttributeStrength;
  onStrengthSelect: (strength: AttributeStrength) => void;
}

/**
 * StrengthMenu component for selecting attribute strength levels.
 *
 * Renders a dropdown select menu that allows users to choose from predefined
 * strength values for an attribute. The menu includes scroll buttons for
 * navigating through available options.
 *
 * @component
 * @param {StrengthMenuProps} props - The component props
 * @param {AttributeStrength} props.currentStrength - The currently selected strength value (key)
 * @param {(strength: AttributeStrength) => void} props.onStrengthSelect - Callback function invoked when a strength option is selected *
 * @returns {React.ReactElement} A Select component with strength options
 *
 * @example
 * ```tsx
 * <StrengthMenu
 *   currentStrength="normal"
 *   onStrengthSelect={(strength) => console.log(strength)}
 * />
 * ```
 */
export default function StrengthMenu({
  currentStrength,
  onStrengthSelect,
}: StrengthMenuProps) {
  return (
    <Select.Root
      value={currentStrength}
      onValueChange={(value) => onStrengthSelect(value as AttributeStrength)}
    >
      <Select.Trigger
        className={clsx(
          styles.trigger,
          PLUS_STRENGTHS.has(currentStrength) && styles.plus
        )}
        aria-label="Select Attribute Strength"
      >
        <Select.Value>{strengthDisplayMap[currentStrength]}</Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className={styles.content}
          onCloseAutoFocus={() => event?.preventDefault()}
        >
          <Select.ScrollUpButton className={styles.scrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={styles.viewport}>
            <Select.Group>{AttributeOptions}</Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className={styles.scrollButton}>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
