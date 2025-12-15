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

const strengthDisplayValues = Object.values(strengthDisplayMap);
const strengthDisplayToKeyMap: Record<string, AttributeStrength> =
  Object.fromEntries(
    Object.entries(strengthDisplayMap).map(([key, value]) => [value, key])
  ) as Record<string, AttributeStrength>;

interface StrengthMenuProps {
  currentStrength: AttributeStrength;
  onStrengthSelect: (strength: AttributeStrength) => void;
}

export default function StrengthMenu({
  currentStrength,
  onStrengthSelect,
}: StrengthMenuProps) {
  return (
    <Select.Root
      value={strengthDisplayMap[currentStrength]}
      onValueChange={(value) =>
        onStrengthSelect(strengthDisplayToKeyMap[value])
      }
    >
      <Select.Trigger
        className={clsx(
          styles.trigger,
          currentStrength.includes("plus") && styles.plus
        )}
        aria-label="Select Attribute Strength"
      >
        <Select.Value>{strengthDisplayMap[currentStrength]}</Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles.content}>
          <Select.ScrollUpButton className={styles.scrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={styles.viewport}>
            <Select.Group>
              {strengthDisplayValues.map((strength) => (
                <AttributeOption key={strength} value={strength}>
                  {strength}
                </AttributeOption>
              ))}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className={styles.scrollButton}>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

interface AttributeOptionProps {
  children: React.ReactNode;
  className?: string;
  value: string;
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
