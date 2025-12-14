import { useState } from "react";

type AttributeStrength = "normal" | "plus" | "plusPlus";

class AffectedAttribute {
  public name: string;
  public strength: AttributeStrength;

  constructor(name: string, strength: AttributeStrength) {
    this.name = name;
    this.strength = strength;
  }
}

const useAttributeSelection = (
  initialAttributes: string[],
  noAvailableAttributesText: string
) => {
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