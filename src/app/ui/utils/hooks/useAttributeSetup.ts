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
 * Custom hook for managing attribute setup and lifecycle.
 * Handles adding and deleting attributes while maintaining proper ordering.
 *
 * @param initialAttributes - The initial array of attributes to set up
 * @param syncAffectedAttributes - Callback function to sync affected attributes when changes occur
 *
 * @returns {UseAttributeSetupReturn} Object containing:
 *   - availableAttributes: Current list of managed attributes
 *   - nextAttributeOrderNumber: The order number for the next attribute to be added
 *   - actions: Object containing action handlers:
 *     - addAttribute: Function to add a new attribute to the list
 *     - deleteAttribute: Function to remove an attribute and reorder remaining attributes
 *
 * @example
 * const { availableAttributes, nextAttributeOrderNumber, actions } = useAttributeSetup(
 *   initialAttrs,
 *   (attrs) => updateParentState(attrs)
 * );
 *
 * actions.addAttribute(newAttribute);
 * actions.deleteAttribute(attributeToRemove);
 */
export default function useAttributeSetup(
  initialAttributes: Attribute[],
  syncAffectedAttributes: (attributes: Attribute[]) => void
): UseAttributeSetupReturn {
  const [availableAttributes, setAvailableAttributes] =
    useState<Attribute[]>(initialAttributes);
  const [nextAttributeOrderNumber, setNextAttributeOrderNumber] =
    useState<number>(initialAttributes.length);

  const handleAddAttribute = (attribute: Attribute) => {
    setAvailableAttributes((prev) => [...prev, attribute]);
    setNextAttributeOrderNumber((prev) => prev + 1);
    syncAffectedAttributes([...availableAttributes, attribute]);
  };

  const handleDeleteAttribute = (attribute: Attribute) => {
    setAvailableAttributes((prev) => {
      const updatedAttributes = prev.filter(
        (attr) => attribute.name !== attr.name
      );
      for (let i = attribute.order; i < updatedAttributes.length; i++) {
        updatedAttributes[i].order -= 1;
      }
      syncAffectedAttributes(updatedAttributes);
      return updatedAttributes;
    });
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
