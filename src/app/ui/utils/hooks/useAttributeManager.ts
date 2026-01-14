import { useCallback, useMemo, useState } from "react";
import { Attribute } from "../classesAndInterfaces/AttributesAndQuests";

/**
 * Return type for the `useAttributeManager` hook.
 *
 * @interface AttributeManager
 * @property {Attribute[]} availableAttributes - Array of attributes that are currently available for use.
 * @property {Object} actions - Object containing attribute manipulation functions.
 * @property {(attribute: Attribute) => void} actions.addAttribute - Function to add a new attribute to the setup.
 * @property {(attribute: Attribute) => void} actions.deleteAttribute - Function to remove an attribute from the setup.
 */
interface AttributeManager {
  availableAttributes: Attribute[];
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
 *
 * @returns {AttributeManager} Object containing:
 *   - availableAttributes: Current list of managed attributes
 *   - actions: Object containing action handlers:
 *     - addAttribute: Function to add a new attribute to the list
 *     - deleteAttribute: Function to remove an attribute and reorder remaining attributes
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

  const handleAddAttribute = useCallback(
    (attribute: Attribute) => {
      setAvailableAttributes((prev) => [
        ...prev,
        // Note: Order is also assigned in UI, but is ensured here to prevent desync
        { ...attribute, order: prev.length },
      ]);
    },
    []
  );

  const handleDeleteAttribute = useCallback((attribute: Attribute) => {
    // Note: attributes array is always sorted by order with no gaps
    setAvailableAttributes((prev) => {
      const updatedAttributes = prev.filter(
        (attr) => attribute.name !== attr.name
      );
      for (let i = attribute.order; i < updatedAttributes.length; i++) {
        updatedAttributes[i] = {
          ...updatedAttributes[i],
          order: updatedAttributes[i].order - 1,
        };
      }
      return updatedAttributes;
    });
  }, []);

  const actions = useMemo(
    () => ({
      addAttribute: handleAddAttribute,
      deleteAttribute: handleDeleteAttribute,
    }),
    [handleAddAttribute, handleDeleteAttribute]
  );

  return {
    availableAttributes,
    actions,
  };
}
