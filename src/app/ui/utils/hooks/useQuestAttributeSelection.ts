import { useCallback, useEffect, useState } from "react";
import type { AttributeStrength } from "@/app/ui/utils/types/AttributeStrength";
import {
  type Attribute,
  type AffectedAttribute,
  createAffectedAttribute,
} from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";

export type UseQuestAttributeSelectionReturn = {
  availableAttributes: Attribute[];
  currentAttributeName: string;
  currentAttributeStrength: AttributeStrength;
  selectedAttributes: AffectedAttribute[];
  actions: {
    setCurrentAttributeName: (name: string) => void;
    setAttributeStrength: (strength: AttributeStrength) => void;
    addAffectedAttribute: () => void;
    deleteAffectedAttribute: (name: string) => void;
    resetAttributeSelectionUI: () => void;
  };
};

const DEFAULT_ATTRIBUTE_STRENGTH: AttributeStrength = "normal";

/**
 * Custom hook for managing attribute selection UI state and operations.
 *
 * Handles the selection, addition, and removal of attributes with strength levels,
 * maintaining a list of available and selected attributes.
 *
 * @param {Attribute[]} attributes - Array of all available attributes to choose from
 * @param {string} noAvailableAttributesText - Text to display when no attributes are available
 *
 * @returns {UseQuestAttributeSelectionReturn} Object containing:
 *   - availableAttributes: Array of attributes not yet selected
 *   - currentAttributeName: Name of the currently selected attribute
 *   - currentAttributeStrength: Strength level of the current attribute
 *   - selectedAttributes: Array of added AffectedAttribute objects
 *   - actions: Object containing handler functions:
 *     - setCurrentAttributeName: Update the current attribute selection
 *     - setAttributeStrength: Update the strength level of current attribute
 *     - addAffectedAttribute: Add current attribute to selected list
 *     - deleteAffectedAttribute: Remove attribute from selected list
 *     - resetAttributeSelectionUI: Reset all state to initial values
 *
 * @example
 * const {
 *   availableAttributes,
 *   currentAttributeName,
 *   selectedAttributes,
 *   actions
 * } = useQuestAttributeSelection(['Strength', 'Dexterity', 'Wisdom'], 'No attributes');
 *
 * actions.addAffectedAttribute();
 * actions.deleteAffectedAttribute('Strength');
 * actions.resetAttributeSelectionUI();
 */
const useQuestAttributeSelection = (
  attributes: Attribute[],
  noAvailableAttributesText: string
): UseQuestAttributeSelectionReturn => {
  // Consider useReducer for selectedAttributes, availableAttributes, and currentAttributeName;
  const [availableAttributes, setAvailableAttributes] =
    useState<Attribute[]>(attributes);

  const [currentAttributeName, setCurrentAttributeName] = useState<string>(
    attributes[0]?.name || noAvailableAttributesText
  );

  const [currentAttributeStrength, setCurrentAttributeStrength] =
    useState<AttributeStrength>(DEFAULT_ATTRIBUTE_STRENGTH);

  const [selectedAttributes, setSelectedAttributes] = useState<
    AffectedAttribute[]
  >([]);

  // Helper to check if current attribute is no longer available
  const isCurrentAttributeNotAvailable = useCallback(
    (currentAttribute: string, availableAttributes: Attribute[]) => {
      return (
        currentAttribute !== noAvailableAttributesText &&
        !availableAttributes.some((attr) => attr.name === currentAttribute)
      );
    },
    [noAvailableAttributesText]
  );

  // Effect to sync available and selected attributes when user adds/removes attributes
  useEffect(() => {
    // Update available attributes when user adds or removes attributes
    const currentlySelectedAttributeNames = new Set(
      selectedAttributes.map((attr) => attr.name)
    );
    const updatedAvailableAttributes = attributes.filter(
      (attr) => !currentlySelectedAttributeNames.has(attr.name)
    );
    setAvailableAttributes(updatedAvailableAttributes);

    // Update selected attributes if any previously selected were removed by user
    setSelectedAttributes((prevSelected) =>
      prevSelected.filter((attr) =>
        attributes.some((a) => a.name === attr.name)
      )
    );

    // Update current attribute name if it's no longer available
    if (
      isCurrentAttributeNotAvailable(
        currentAttributeName,
        updatedAvailableAttributes
      )
    ) {
      setCurrentAttributeName(
        updatedAvailableAttributes[0]?.name || noAvailableAttributesText
      );
    }

    // If user adds an attribute and current is the no-attributes text, set to first available
    if (
      updatedAvailableAttributes.length &&
      currentAttributeName === noAvailableAttributesText
    ) {
      setCurrentAttributeName(updatedAvailableAttributes[0].name);
    }
  }, [attributes]); // Only run when attributes prop changes (user adds/removes attributes)

  const handleAddAffectedAttribute = useCallback(() => {
    // TODO: Add proper error handling and user feedback
    if (currentAttributeName === noAvailableAttributesText) {
      return;
    }
    if (selectedAttributes.some((attr) => attr.name === currentAttributeName)) {
      return;
    }

    const updatedAvailableAttributes = availableAttributes.filter(
      (attr) => attr.name !== currentAttributeName
    );

    setAvailableAttributes(updatedAvailableAttributes);
    setCurrentAttributeName(
      updatedAvailableAttributes[0]?.name || noAvailableAttributesText
    );

    setSelectedAttributes((prevSelected) => [
      ...prevSelected,
      createAffectedAttribute(currentAttributeName, currentAttributeStrength),
    ]);

    setCurrentAttributeStrength(DEFAULT_ATTRIBUTE_STRENGTH);
  }, [
    currentAttributeName,
    currentAttributeStrength,
    noAvailableAttributesText,
    selectedAttributes,
    availableAttributes,
  ]);

  const handleDeleteAffectedAttribute = useCallback(
    (attributeName: string) => {
      setSelectedAttributes((prevSelected) =>
        prevSelected.filter((attr) => attr.name !== attributeName)
      );
      setAvailableAttributes((prevAvailable) => {
        const attribute = attributes.find(
          (attr) => attr.name === attributeName
        );
        if (!attribute) {
          console.error(
            `Attribute "${attributeName}" not found in affected attributes list.`
          );
          return prevAvailable;
        }
        const updatedAvailableAttributes = [...prevAvailable, attribute];
        // Sort available attributes to maintain order
        return updatedAvailableAttributes.sort((a, b) => a.order - b.order);
      });
      setCurrentAttributeName((prevCurrent) =>
        prevCurrent === noAvailableAttributesText ? attributeName : prevCurrent
      );
    },
    [attributes, noAvailableAttributesText]
  );

  const handleResetAttributeSelectionUI = useCallback(() => {
    setAvailableAttributes(attributes);
    setSelectedAttributes([]);
    setCurrentAttributeName(attributes[0]?.name || noAvailableAttributesText);
    setCurrentAttributeStrength(DEFAULT_ATTRIBUTE_STRENGTH);
  }, [attributes, noAvailableAttributesText]);

  return {
    availableAttributes,
    currentAttributeName,
    currentAttributeStrength,
    selectedAttributes,
    actions: {
      setCurrentAttributeName,
      setAttributeStrength: setCurrentAttributeStrength,
      addAffectedAttribute: handleAddAffectedAttribute,
      deleteAffectedAttribute: handleDeleteAffectedAttribute,
      resetAttributeSelectionUI: handleResetAttributeSelectionUI,
    },
  };
};

export default useQuestAttributeSelection;
