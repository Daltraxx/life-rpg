import { useState } from "react";

export type AttributeStrength = "normal" | "plus" | "plusPlus";

// TODO: Move classes to their own files
export class AffectedAttribute {
  public name: string;
  public strength: AttributeStrength;

  constructor(name: string, strength: AttributeStrength) {
    this.name = name;
    this.strength = strength;
  }
}

export type UseAttributeSelection = {
  availableAttributes: string[];
  currentAttributeName: string;
  currentAttributeStrength: AttributeStrength;
  selectedAttributes: AffectedAttribute[];
  attributeNameMenuOpen: boolean;
  attributeStrengthMenuOpen: boolean;
  actions: {
    setCurrentAttributeName: (name: string) => void;
    setAttributeStrength: (strength: AttributeStrength) => void;
    addAffectedAttribute: () => void;
    deleteAffectedAttribute: (name: string) => void;
    resetAttributeSelectionUI: () => void;
    setAttributeNameMenuOpen: (open: boolean) => void;
    setAttributeStrengthMenuOpen: (open: boolean) => void;
  };
}

/**
 * Hook for managing attribute selection state and operations.
 * 
 * Handles the selection, addition, and deletion of attributes with associated strength levels.
 * Maintains lists of available and selected attributes, manages UI state for dropdown menus,
 * and provides callbacks for attribute operations.
 * 
 * @param initialAttributes - Array of attribute names available for selection
 * @param noAvailableAttributesText - Text to display when no attributes are available
 * 
 * @returns Object containing:
 * @returns {string[]} availableAttributes - Currently available attributes that can be selected
 * @returns {string} currentAttributeName - Name of the currently selected attribute
 * @returns {AttributeStrength} currentAttributeStrength - Strength level of the current attribute ("normal" by default)
 * @returns {AffectedAttribute[]} selectedAttributes - Array of attributes that have been selected
 * @returns {boolean} attributeNameMenuOpen - Whether the attribute name dropdown menu is open
 * @returns {boolean} attributeStrengthMenuOpen - Whether the attribute strength dropdown menu is open
 * @returns {Object} actions - Object containing callback functions:
 * @returns {(name: string) => void} actions.setCurrentAttributeName - Sets the currently selected attribute name
 * @returns {(strength: AttributeStrength) => void} actions.setAttributeStrength - Sets the strength of the current attribute and closes the menu
 * @returns {() => void} actions.addAffectedAttribute - Adds the current attribute to selected attributes, removes from available
 * @returns {(name: string) => void} actions.deleteAffectedAttribute - Removes attribute from selected and returns it to available
 * @returns {() => void} actions.resetAttributeSelectionUI - Resets all state to initial values
 * @returns {(open: boolean) => void} actions.setAttributeNameMenuOpen - Controls attribute name menu visibility
 * @returns {(open: boolean) => void} actions.setAttributeStrengthMenuOpen - Controls attribute strength menu visibility
 */
const useAttributeSelection = (
  initialAttributes: string[],
  noAvailableAttributesText: string
): UseAttributeSelection => {
  const [availableAttributes, setAvailableAttributes] =
    useState<string[]>(initialAttributes);
  
  const [currentAttributeName, setCurrentAttributeName] = useState<string>(
    availableAttributes[0] || noAvailableAttributesText
  );

  const [currentAttributeStrength, setCurrentAttributeStrength] =
    useState<AttributeStrength>("normal");
  
  const [selectedAttributes, setSelectedAttributes] = useState<
    AffectedAttribute[]
    >([]);
  
  const [attributeNameMenuOpen, setAttributeNameMenuOpen] =
    useState<boolean>(false);
  
  const [attributeStrengthMenuOpen, setAttributeStrengthMenuOpen] =
    useState<boolean>(false);
  
  const handleSetAttributeStrength = (strength: AttributeStrength) => {
      setCurrentAttributeStrength(strength);
      setAttributeStrengthMenuOpen(false);
  };
  
  const handleAddAffectedAttribute = () => {
    // TODO: Add proper error handling and user feedback
    if (currentAttributeName === noAvailableAttributesText) {
      return;
    }
    if (selectedAttributes.some((attr) => attr.name === currentAttributeName)) {
      return;
    }

    setAvailableAttributes((prevAvailable) => {
      const updatedAvailableAttributes = prevAvailable.filter(
        (attr) => attr !== currentAttributeName
      );
      setCurrentAttributeName(
        updatedAvailableAttributes[0] || noAvailableAttributesText
      );
      return updatedAvailableAttributes;
    });

    setSelectedAttributes((prevSelected) => [
      ...prevSelected,
      new AffectedAttribute(currentAttributeName, currentAttributeStrength),
    ]);
  };

  const handleDeleteAffectedAttribute = (attributeName: string) => {
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
  };

  const handleResetAttributeSelectionUI = () => {
    setAvailableAttributes(initialAttributes);
    setSelectedAttributes([]);
    setCurrentAttributeName(initialAttributes[0] || noAvailableAttributesText);
    setCurrentAttributeStrength("normal");
    setAttributeNameMenuOpen(false);
    setAttributeStrengthMenuOpen(false);
  }

  return {
    availableAttributes,
    currentAttributeName,
    currentAttributeStrength,
    selectedAttributes,
    attributeNameMenuOpen,
    attributeStrengthMenuOpen,
    actions: {
      setCurrentAttributeName,
      setAttributeStrength: handleSetAttributeStrength,
      addAffectedAttribute: handleAddAffectedAttribute,
      deleteAffectedAttribute: handleDeleteAffectedAttribute,
      resetAttributeSelectionUI: handleResetAttributeSelectionUI,
      setAttributeNameMenuOpen,
      setAttributeStrengthMenuOpen 
    }
  }
};

export default useAttributeSelection;