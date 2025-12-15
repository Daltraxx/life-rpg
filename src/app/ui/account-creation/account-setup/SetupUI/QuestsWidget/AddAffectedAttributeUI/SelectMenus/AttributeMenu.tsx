"use client";

import styles from "./styles.module.css";
import clsx from "clsx";
import { Select } from "radix-ui";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@radix-ui/react-icons";

interface AttributeMenuProps {
  availableAttributes: string[];
  currentAttribute: string;
  onAttributeSelect: (attribute: string) => void;
}

/**
 * Renders a dropdown menu for selecting an attribute from a list of available attributes.
 *
 * @component
 * @param {AttributeMenuProps} props - The component props
 * @param {string[]} props.availableAttributes - Array of attribute names available for selection
 * @param {string} props.currentAttribute - The currently selected attribute value
 * @param {(value: string) => void} props.onAttributeSelect - Callback function invoked when an attribute is selected
 *
 * @returns {JSX.Element} A Select component with scrollable attribute options
 *
 * @example
 * ```tsx
 * <AttributeMenu
 *   availableAttributes={['Strength', 'Dexterity', 'Wisdom']}
 *   currentAttribute="Strength"
 *   onAttributeSelect={(attribute) => setSelectedAttribute(attribute)}
 * />
 * ```
 */
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
      <Select.Trigger
        className={styles.trigger}
        aria-label="Select Attribute"
      >
        <Select.Value>{currentAttribute}</Select.Value>
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
