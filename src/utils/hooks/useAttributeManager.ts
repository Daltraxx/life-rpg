import { useCallback, useMemo, useState } from "react";
import { Attribute } from "@/utils/types/AttributesAndQuests";
import swapArrayElements from "@/utils/helpers/swapArrayElements";

/**
 * Return type for the `useAttributeManager` hook.
 *
 * @interface AttributeManager
 * @property {Attribute[]} availableAttributes - Array of attributes that are currently available for use.
 * @property {Object} actions - Object containing attribute manipulation functions.
 * @property {(attribute: Attribute) => void} actions.addAttribute - Function to add a new attribute to the setup.
 * @property {(attribute: Attribute) => void} actions.deleteAttribute - Function to remove an attribute from the setup.
 * @property {(attribute: Attribute) => void} actions.swapAttributeUp - Function to move an attribute up in the order.
 * @property {(attribute: Attribute) => void} actions.swapAttributeDown - Function to move an attribute down in the order.
 */
export interface AttributeManager {
  availableAttributes: Attribute[];
  actions: {
    addAttribute: (attribute: Attribute) => void;
    deleteAttribute: (attribute: Attribute) => void;
    swapAttributeUp: (attribute: Attribute) => void;
    swapAttributeDown: (attribute: Attribute) => void;
  };
}

/**
 * Custom hook for managing attribute setup and lifecycle.
 * Handles adding and deleting attributes while maintaining proper ordering.
 *
 * @param initialAttributes - The initial array of attributes to set up
 *
 * @returns {AttributeManager} Object containing:
 *   - availableAttributes: Current list of managed attributes
 *   - actions: Object containing action handlers:
 *     - addAttribute: Function to add a new attribute to the list
 *     - deleteAttribute: Function to remove an attribute from the list
 *     - swapAttributeUp: Function to move an attribute up in the order
 *     - swapAttributeDown: Function to move an attribute down in the order
 *
 * @example
 * const { availableAttributes, actions } = useAttributeManager(initialAttrs);
 *
 * actions.addAttribute(newAttribute);
 * actions.deleteAttribute(attributeToRemove);
 */
export default function useAttributeManager(
  initialAttributes: Attribute[]
): AttributeManager {
  const [availableAttributes, setAvailableAttributes] =
    useState<Attribute[]>(initialAttributes);

  const handleAddAttribute = useCallback((attribute: Attribute) => {
    setAvailableAttributes((prev) => [...prev, attribute]);
  }, []);

  const handleDeleteAttribute = useCallback((attribute: Attribute) => {
    setAvailableAttributes((prev) =>
      prev.filter((attr) => attr.name !== attribute.name)
    );
  }, []);

  const swapAttributeUp = useCallback((attribute: Attribute) => {
    setAvailableAttributes((prev) => {
      const index = prev.findIndex((attr) => attr.name === attribute.name);
      if (index === -1 || index === 0) {
        const msg = index === -1 ? "not found" : "already at the top";
        console.warn(`Attribute ${msg} when swapping up:`, attribute);
        return prev;
      }
      return swapArrayElements(prev, index, index - 1);
    });
  }, []);

  const swapAttributeDown = useCallback((attribute: Attribute) => {
    setAvailableAttributes((prev) => {
      const index = prev.findIndex((attr) => attr.name === attribute.name);
      if (index === -1 || index === prev.length - 1) {
        const msg = index === -1 ? "not found" : "already at the bottom";
        console.warn(`Attribute ${msg} when swapping down:`, attribute);
        return prev;
      }
      return swapArrayElements(prev, index, index + 1);
    });
  }, []);

  const actions = useMemo(
    () => ({
      addAttribute: handleAddAttribute,
      deleteAttribute: handleDeleteAttribute,
      swapAttributeUp,
      swapAttributeDown,
    }),
    [
      handleAddAttribute,
      handleDeleteAttribute,
      swapAttributeUp,
      swapAttributeDown,
    ]
  );

  return {
    availableAttributes,
    actions,
  };
}
