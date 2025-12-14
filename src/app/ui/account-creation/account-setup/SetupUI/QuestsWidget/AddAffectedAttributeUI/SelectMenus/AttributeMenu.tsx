"use client";

import styles from "./styles.module.css";
import clsx from "clsx";
import { Select } from "radix-ui";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";

interface AttributeMenuProps {
  availableAttributes: string[];
  currentAttribute: string;
  onAttributeSelect: (attribute: string) => void;
}

export default function AttributeMenu({
  availableAttributes,
  currentAttribute,
  onAttributeSelect,
}: AttributeMenuProps) {
  return (
    <Select.Root
      value={currentAttribute}
      onValueChange={(value) => onAttributeSelect(value)}
    >
      <Select.Trigger className={styles.trigger} aria-label="Select Attribute">
        <Select.Value>{currentAttribute}</Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles.content}>
          <Select.ScrollUpButton className={styles.scrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={styles.viewport}>
            <Select.Group>
              {availableAttributes.map((attribute) => (
                <AttributeOption key={attribute} value={attribute}>
                  {attribute}
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
  ...props
}: AttributeOptionProps) => {
  return (
    <Select.Item className={clsx(styles.item, className)} {...props}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className={styles.itemIndicator}>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
};
