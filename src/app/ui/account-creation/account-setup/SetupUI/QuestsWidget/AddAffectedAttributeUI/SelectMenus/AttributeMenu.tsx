"use client";

import styles from "./styles.module.css";
import clsx from "clsx";
import { Select } from "radix-ui";
import { type Attribute } from "@/utils/types/AttributesAndQuests";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@radix-ui/react-icons";

interface AttributeMenuProps {
  availableAttributes: Attribute[];
  currentAttribute: string;
  onAttributeSelect: (attribute: string) => void;
  noAvailableAttributesText: string;
}

/**
 * A dropdown menu component for selecting character attributes.
 *
 * This component renders a select menu using Radix UI's Select primitive,
 * allowing users to choose from available attributes. It displays the currently
 * selected attribute and provides a scrollable list of options.
 *
 * @param props - The component props
 * @param props.availableAttributes - Array of attribute objects that can be selected
 * @param props.currentAttribute - The currently selected attribute value
 * @param props.onAttributeSelect - Callback function invoked when an attribute is selected,
 *                                   receives the selected attribute value as a parameter
 * @param props.noAvailableAttributesText - Text to display when no attributes are available for selection
 *
 * @returns A controlled select menu component for attribute selection
 *
 * @example
 * ```tsx
 * <AttributeMenu
 *   availableAttributes={[
 *     { name: "Strength" },
 *     { name: "Intelligence" }
 *   ]}
 *   currentAttribute="Strength"
 *   onAttributeSelect={(value) => console.log(value)}
 * />
 * ```
 */
export default function AttributeMenu({
  availableAttributes,
  currentAttribute,
  onAttributeSelect,
  noAvailableAttributesText,
}: AttributeMenuProps) {
  return (
    <Select.Root
      value={currentAttribute}
      onValueChange={(value) => {
        // Prevents calling the callback with an empty value,
        // which can happen when all attributes are selected/removed or UI is reset.
        if (value) onAttributeSelect(value);
      }}
    >
      <Select.Trigger
        className={styles.trigger}
        aria-label={
          availableAttributes.length === 0
            ? noAvailableAttributesText
            : "Select Attribute"
        }
        disabled={availableAttributes.length === 0}
      >
        <Select.Value>
          {availableAttributes.length === 0
            ? noAvailableAttributesText
            : currentAttribute}
        </Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className={styles.content}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Select.ScrollUpButton className={styles.scrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={styles.viewport}>
            <Select.Group>
              {availableAttributes.map((attribute) => (
                <AttributeOption key={attribute.name} value={attribute.name}>
                  {attribute.name}
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
