import { useState } from "react";
import { Attribute } from "../classesAndInterfaces/AttributesAndQuests";

/**
 * Return type for the `useAttributeSetup` hook.
 *
 * @interface UseAttributeSetupReturn
 * @property {Attribute[]} availableAttributes - Array of attributes that are currently available for use.
 * @property {number} nextAttributeOrderNumber - The next sequential order number to assign to a new attribute.
 * @property {Object} actions - Object containing attribute manipulation functions.
 * @property {(attribute: Attribute) => void} actions.addAttribute - Function to add a new attribute to the setup.
 * @property {(attribute: Attribute) => void} actions.deleteAttribute - Function to remove an attribute from the setup.
 */
interface UseAttributeSetupReturn {
  availableAttributes: Attribute[];
  nextAttributeOrderNumber: number;
  actions: {
    addAttribute: (attribute: Attribute) => void;
    deleteAttribute: (attribute: Attribute) => void;
  };
}

/**
 * Hook for managing attribute setup state and operations.
 * 
 * @param initialAttributes - The initial array of attributes to set up
 * @returns {UseAttributeSetupReturn}An object containing:
 *   - availableAttributes: The current list of available attributes
 *   - nextAttributeOrderNumber: The order number for the next attribute to be added
 *   - actions: An object with methods to manipulate attributes:
 *     - addAttribute: Adds a new attribute to the available attributes list
 *     - deleteAttribute: Removes an attribute and reorders remaining attributes
 * 
 * @example
 * const { availableAttributes, nextAttributeOrderNumber, actions } = useAttributeSetup(initialAttrs);
 * actions.addAttribute(newAttribute);
 * actions.deleteAttribute(attributeToRemove);
 */
export default function useAttributeSetup(
  initialAttributes: Attribute[]
): UseAttributeSetupReturn {
  const [availableAttributes, setAvailableAttributes] =
    useState<Attribute[]>(initialAttributes);
  const [nextAttributeOrderNumber, setNextAttributeOrderNumber] =
    useState<number>(initialAttributes.length);

  const handleAddAttribute = (attribute: Attribute) => {
    setAvailableAttributes((prev) => [...prev, attribute]);
    setNextAttributeOrderNumber((prev) => prev + 1);
  };

  const handleDeleteAttribute = (attribute: Attribute) => {
    const updatedAttributes = availableAttributes.filter(
      (attr) => attribute.name !== attr.name
    );
    for (let i = attribute.order; i < updatedAttributes.length; i++) {
      updatedAttributes[i].order -= 1;
    }
    setAvailableAttributes(updatedAttributes);
    setNextAttributeOrderNumber((prev) => prev - 1);
  };

  return {
    availableAttributes,
    nextAttributeOrderNumber,
    actions: {
      addAttribute: handleAddAttribute,
      deleteAttribute: handleDeleteAttribute,
    },
  };
}
