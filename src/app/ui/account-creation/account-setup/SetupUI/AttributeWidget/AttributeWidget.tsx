"use client";

import Heading from "@/app/ui/JSXWrappers/Heading/Heading";
import { Label, Paragraph } from "@/app/ui/JSXWrappers/TextWrappers";
import styles from "./styles.module.css";
import { useState } from "react";
import AttributeListItem from "./AttributeList/AttributeListItem";
import clsx from "clsx";

const INITIAL_ATTRIBUTES: string[] = [
  "Discipline",
  "Vitality",
  "Intelligence",
  "Fitness",
];

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
 * <AttributeWidget />
 *
 * @remarks
 * - Duplicate checking is performed directly against current state
 * - Displays validation errors for empty or duplicate entries
 * - Enter key and button click both trigger attribute addition
 * - Maintains accessibility with proper aria-describedby and htmlFor attributes
 */
export default function AttributeWidget({ className }: { className?: string }) {
  // TODO: Persist attributes to context/state management
  const [attributes, setAttributes] = useState<string[]>(INITIAL_ATTRIBUTES);
  const [newAttribute, setNewAttribute] = useState<string>("");
  const [addAttributeError, setAddAttributeError] = useState("");

  const handleAddAttribute = (attribute: string) => {
    const trimmedAttribute = attribute.trim();
    const trimmedAttributeLowerCase = trimmedAttribute.toLowerCase();
    const attributeSet = new Set(attributes.map((attr) => attr.toLowerCase()));

    if (trimmedAttributeLowerCase.length === 0) {
      setAddAttributeError("Please enter an attribute.");
      return;
    }
    if (attributeSet.has(trimmedAttributeLowerCase)) {
      setAddAttributeError("Attribute already exists.");
      return;
    }

    setAddAttributeError("");

    setAttributes((prevAttributes) => [...prevAttributes, trimmedAttribute]);
    setNewAttribute("");
  };

  const handleDeleteAttribute = (attribute: string) => {
    setAttributes((prevAttributes) =>
      prevAttributes.filter((attr) => attr !== attribute)
    );
  };

  const attributeList = attributes.map((attribute) => (
    <AttributeListItem
      key={attribute}
      attribute={attribute}
      onDelete={handleDeleteAttribute}
    />
  ));

  return (
    <section className={clsx(styles.widgetContainer, className)}>
      <Heading as="h3" size="36" className={styles.heading}>
        Add Attributes
      </Heading>
      <Paragraph className={styles.description}>
        Add the attributes you would improve in yourself. Added attributes
        can then be applied to quests, and earn experience when those quests are
        completed.
      </Paragraph>

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
            value={newAttribute}
            className={styles.addAttributeInput}
            onChange={(e) => {
              if (addAttributeError) setAddAttributeError("");
              setNewAttribute(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddAttribute(newAttribute);
              }
            }}
            aria-describedby={addAttributeError ? "attribute-error" : undefined}
          />
          <button
            type="button"
            className={styles.addAttributeButton}
            onClick={() => handleAddAttribute(newAttribute)}
          >
            ADD
          </button>
        </div>
      </div>
      {addAttributeError && (
        <Paragraph
          id="attribute-error"
          size="20"
          className={styles.addAttributeError}
        >
          {addAttributeError}
        </Paragraph>
      )}

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
