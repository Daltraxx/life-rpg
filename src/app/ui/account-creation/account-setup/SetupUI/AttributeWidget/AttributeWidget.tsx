"use client";

import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import {
  Label,
  ListItem,
  Paragraph,
} from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import styles from "./styles.module.css";
import { useEffect, useRef, useState } from "react";
import AttributeListItem from "./AttributeListItem/AttributeListItem";
import clsx from "clsx";
import {
  type Attribute,
  createAttribute,
} from "@/utils/types/AttributesAndQuests";
import type { AttributeManager } from "@/utils/hooks/useAttributeManager";
import { createAttributeNameSchema } from "@/utils/validations/attributeName";

interface AttributeWidgetProps {
  attributes: Attribute[];
  attributeManager: AttributeManager;
  className?: string;
}

/**
 * AttributeWidget component for managing custom attributes in account setup.
 *
 * Allows users to add and delete custom attributes with validation to prevent
 * empty entries and duplicates. Uses the component's attributes state as the
 * single source of truth for validation and rendering.
 *
 * @component
 * @returns A section containing an attribute input form and a list of current attributes with delete functionality.
 *
 * @example
 * // Basic usage in account setup flow
 * <AttributeWidget attributes={attributes} attributeManager={attributeManager} />
 *
 * @remarks
 * - Duplicate checking is performed directly against current state
 * - Displays validation errors for empty or duplicate entries
 * - Enter key and button click both trigger attribute addition
 * - Maintains accessibility with proper aria-describedby and htmlFor attributes
 */
export default function AttributeWidget({
  attributes,
  attributeManager,
  className,
}: AttributeWidgetProps) {
  const [newAttributeName, setNewAttributeName] = useState<string>("");
  const [addAttributeError, setAddAttributeError] = useState<string[]>([]);

  const { addAttribute, deleteAttribute, swapAttributeUp, swapAttributeDown } =
    attributeManager.actions;

  // Handle adding a new attribute with validation
  const handleAddAttribute = (attributeName: string) => {
    const schema = createAttributeNameSchema(attributes);
    const parseResult = schema.safeParse(attributeName);
    if (!parseResult.success) {
      setAddAttributeError(parseResult.error.issues.map((err) => err.message));
      return;
    }

    setAddAttributeError([]);
    const newAttribute = createAttribute(parseResult.data);
    addAttribute(newAttribute);
    setNewAttributeName("");
  };

  // Debounce validation on input change if there are existing errors
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleChangeAttributeName = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setNewAttributeName(e.target.value);
    if (addAttributeError.length > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        const schema = createAttributeNameSchema(attributes);
        const parseResult = schema.safeParse(e.target.value);
        if (!parseResult.success) {
          setAddAttributeError(
            parseResult.error.issues.map((err) => err.message),
          );
        } else {
          setAddAttributeError([]);
        }
      }, 300);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Render the list of current attributes
  const attributeList = attributes.map((attribute, index) => (
    <AttributeListItem
      key={attribute.name}
      attribute={attribute}
      onDelete={deleteAttribute}
      handleMoveUp={swapAttributeUp}
      handleMoveDown={swapAttributeDown}
      attributesLength={attributes.length}
      index={index}
    />
  ));

  return (
    <section className={clsx(styles.widgetContainer, className)}>
      {/* HEADING AND DESCRIPTION */}
      <Heading as="h3" size="36" className={styles.heading}>
        Add Attributes
      </Heading>
      <Paragraph className={styles.description}>
        Add the attributes you would like to improve in yourself. Added
        attributes can then be applied to quests, and earn experience when those
        quests are completed.
      </Paragraph>

      {/* ADD ATTRIBUTE INPUT AND BUTTON */}
      <div className={styles.addAttributeContainer}>
        <Label
          htmlFor="add-attribute"
          size="24"
          className={styles.addAttributeLabel}
        >
          Attribute Name:
        </Label>
        <div className={styles.addAttributeField}>
          <input
            type="text"
            id="add-attribute"
            value={newAttributeName}
            className={styles.addAttributeInput}
            onChange={handleChangeAttributeName}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddAttribute(newAttributeName);
              }
            }}
            aria-describedby={addAttributeError ? "attribute-error" : undefined}
          />
          <button
            type="button"
            className={styles.addAttributeButton}
            onClick={() => handleAddAttribute(newAttributeName)}
          >
            ADD
          </button>
        </div>
      </div>

      {/* ATTRIBUTE NAME ERROR MESSAGES */}
      {addAttributeError.length > 0 && (
        <ul
          id="attribute-error"
          role="alert"
          aria-atomic="true"
          className={styles.addAttributeErrorContainer}
        >
          {addAttributeError.map((error, index) => (
            <ListItem
              size="20"
              className={styles.addAttributeError}
              key={index}
            >
              {error}
            </ListItem>
          ))}
        </ul>
      )}

      {/* CURRENT ATTRIBUTES LIST */}
      <div>
        <div className={styles.currentAttributesHeadingContainer}>
          <Heading
            as="h4"
            size="24"
            className={styles.currentAttributesHeading}
          >
            Current Attributes
          </Heading>
        </div>
        <ul>{attributeList}</ul>
      </div>
    </section>
  );
}
