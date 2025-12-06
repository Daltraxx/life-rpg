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
 * empty entries and duplicates. Maintains a set of attributes and displays them
 * in a list format.
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
 * - Uses a Set for efficient duplicate checking
 * - Automatically capitalizes the first letter of attribute names
 * - Displays validation errors for empty or duplicate entries
 * - Enter key and button click both trigger attribute addition
 * - Maintains accessibility with proper aria-describedby and htmlFor attributes
 */
export default function AttributeWidget(): JSX.Element {
  const [attributes, setAttributes] = useState<string[]>(INITIAL_ATTRIBUTES);
  const [attributeSet, setAttributeSet] = useState(
    () => new Set(INITIAL_ATTRIBUTES)
  );
  const [newAttribute, setNewAttribute] = useState<string>("");
  const [addAttributeError, setAddAttributeError] = useState("");

  const handleAddAttribute = (attribute: string) => {
    const trimmedAttribute = attribute.trim();
    const capitalizedAttribute =
      trimmedAttribute.charAt(0).toUpperCase() + trimmedAttribute.slice(1);
    if (capitalizedAttribute.length === 0) {
      setAddAttributeError("Please enter an attribute.");
      return;
    }
    if (attributeSet.has(capitalizedAttribute)) {
      setAddAttributeError("Attribute already exists.");
      return;
    }
    setAddAttributeError("");
    setAttributeSet((prevSet) => new Set(prevSet).add(capitalizedAttribute));
    setAttributes((prevAttributes) => [...prevAttributes, capitalizedAttribute]);
    setNewAttribute("");
  };

  const handleDeleteAttribute = (attribute: string) => {
    const newAttributeSet = new Set(attributeSet);
    newAttributeSet.delete(attribute);
    setAttributeSet(newAttributeSet);
    setAttributes(Array.from(newAttributeSet));
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
