"use client";

import Heading from "@/app/ui/JSXWrappers/Heading";
import { Label } from "../../../../JSXWrappers/TextWrappers";
import styles from "./styles.module.css";
import { type JSX, useState } from "react";
import AttributeListItem from "./AttributeList/AttributeListItem";

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
 * @returns {JSX.Element} A section containing an attribute input form and a list
 *                        of current attributes with delete functionality.
 *
 * @example
 * // Basic usage in account setup flow
 * <AttributeWidget />
 *
 * @remarks
 * - Duplicate checking is performed directly against current state
 * - Automatically capitalizes the first letter of attribute names
 * - Displays validation errors for empty or duplicate entries
 * - Enter key and button click both trigger attribute addition
 * - Maintains accessibility with proper aria-describedby and htmlFor attributes
 */
export default function AttributeWidget(): JSX.Element {
  const [attributes, setAttributes] = useState<string[]>(INITIAL_ATTRIBUTES);
  const [newAttribute, setNewAttribute] = useState<string>("");
  const [addAttributeError, setAddAttributeError] = useState("");

  const handleAddAttribute = (attribute: string) => {
    const trimmedAttribute = attribute.trim();
    const trimmedAttributeLowerCase = trimmedAttribute.toLowerCase();
    const attributeSet = new Set(attributes.map((attr) => attr.toLowerCase()));

    if (trimmedAttribute.length === 0) {
      setAddAttributeError("Please enter an attribute.");
      return;
    }
    if (attributeSet.has(trimmedAttributeLowerCase)) {
      setAddAttributeError("Attribute already exists.");
      return;
    }

    setAddAttributeError("");

    const capitalizedAttribute =
      trimmedAttribute.charAt(0).toUpperCase() + trimmedAttribute.slice(1);

    setAttributes((prevAttributes) => [
      ...prevAttributes,
      capitalizedAttribute,
    ]);
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
    <section className={styles.widgetContainer}>
      <Heading as="h3" size="36">
        Add Attributes
      </Heading>

      <div className={styles.addAttributeContainer}>
        <Label
          htmlFor="add-attribute"
          size="20"
          className={styles.addAttributeLabel}
        >
          Attribute Name:
        </Label>
        <div className={styles.addAttributeField}>
          <input
            type="text"
            id="add-attribute"
            value={newAttribute}
            onChange={(e) => setNewAttribute(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
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
        {addAttributeError && (
          <p id="attribute-error" className={styles.attributeError}>
            {addAttributeError}
          </p>
        )}
      </div>

      <div>
        <Heading as="h4" size="24">
          Current Attributes
        </Heading>
        <ul>{attributeList}</ul>
      </div>
    </section>
  );
}
