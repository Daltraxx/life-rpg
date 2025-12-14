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
}

export default function AttributeMenu({
  availableAttributes,
  currentAttribute,
}: AttributeMenuProps) {
  return (
    <Select.Root>
      <Select.Trigger
        className={styles.selectTrigger}
        aria-label="Select Attribute"
      >
        <Select.Value>{currentAttribute}</Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles.selectContent}>
          <Select.ScrollUpButton className={styles.ScrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={styles.selectViewport}>
            <Select.Group>
              {availableAttributes.map((attribute) => (
                <AttributeOption key={attribute} value={attribute}>
                  {attribute}
                </AttributeOption>
              ))}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className={styles.ScrollButton}>
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
    <Select.Item className={clsx(styles.selectItem, className)} {...props}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className={styles.selectItemIndicator}>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
};
