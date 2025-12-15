import { useCallback, useState } from "react";
import type { AttributeStrength } from "@/app/ui/utils/types/AttributeStrength";
import {
  AffectedAttribute,
  createAffectedAttribute,
} from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";

export type UseAttributeSelection = {
  availableAttributes: string[];
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
 * @param {string[]} initialAttributes - Array of all available attributes to choose from
 * @param {string} noAvailableAttributesText - Text to display when no attributes are available
 * 
 * @returns {UseAttributeSelection} Object containing:
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
 * } = useAttributeSelection(['Strength', 'Dexterity', 'Wisdom'], 'No attributes');
 * 
 * actions.addAffectedAttribute();
 * actions.deleteAffectedAttribute('Strength');
 * actions.resetAttributeSelectionUI();
 */
const useAttributeSelection = (
  initialAttributes: string[],
  noAvailableAttributesText: string
): UseAttributeSelection => {
  const [availableAttributes, setAvailableAttributes] =
    useState<string[]>(initialAttributes);

  const [currentAttributeName, setCurrentAttributeName] = useState<string>(
    initialAttributes[0] || noAvailableAttributesText
  );

  const [currentAttributeStrength, setCurrentAttributeStrength] =
    useState<AttributeStrength>("normal");

  const [selectedAttributes, setSelectedAttributes] = useState<
    AffectedAttribute[]
  >([]);

  const handleSetAttributeStrength = useCallback(
    (strength: AttributeStrength) => {
      setCurrentAttributeStrength(strength);
    },
    []
  );
  const handleAddAffectedAttribute = useCallback(() => {
    // TODO: Add proper error handling and user feedback
    if (currentAttributeName === noAvailableAttributesText) {
      return;
    }
    if (selectedAttributes.some((attr) => attr.name === currentAttributeName)) {
      return;
    }

    const updatedAvailableAttributes = availableAttributes.filter(
      (attr) => attr !== currentAttributeName
    );

    setAvailableAttributes(updatedAvailableAttributes);
    setCurrentAttributeName(
      updatedAvailableAttributes[0] || noAvailableAttributesText
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
  ]);

  const handleDeleteAffectedAttribute = useCallback(
    (attributeName: string) => {
      setSelectedAttributes((prevSelected) =>
        prevSelected.filter((attr) => attr.name !== attributeName)
      );
      setAvailableAttributes((prevAvailable) => {
        const updatedAvailableAttributes = [...prevAvailable, attributeName];
        // Sort available attributes to maintain order
        return updatedAvailableAttributes.sort(
          (a, b) => initialAttributes.indexOf(a) - initialAttributes.indexOf(b)
        );
      });
      setCurrentAttributeName((prevCurrent) =>
        prevCurrent === noAvailableAttributesText ? attributeName : prevCurrent
      );
    },
    [initialAttributes, noAvailableAttributesText]
  );

  const handleResetAttributeSelectionUI = useCallback(() => {
    setAvailableAttributes(initialAttributes);
    setSelectedAttributes([]);
    setCurrentAttributeName(initialAttributes[0] || noAvailableAttributesText);
    setCurrentAttributeStrength(DEFAULT_ATTRIBUTE_STRENGTH);
  }, [initialAttributes, noAvailableAttributesText]);

  return {
    availableAttributes,
    currentAttributeName,
    currentAttributeStrength,
    selectedAttributes,
    actions: {
      setCurrentAttributeName,
      setAttributeStrength: handleSetAttributeStrength,
      addAffectedAttribute: handleAddAffectedAttribute,
      deleteAffectedAttribute: handleDeleteAffectedAttribute,
      resetAttributeSelectionUI: handleResetAttributeSelectionUI,
    },
  };
};

export default useAttributeSelection;
