import { useEffect, useMemo, useReducer } from "react";
import type { AttributeStrength } from "@/app/ui/utils/types/AttributeStrength";
import {
  type Attribute,
  type AffectedAttribute,
  createAffectedAttribute,
} from "@/app/ui/utils/classesAndInterfaces/AttributesAndQuests";

const DEFAULT_ATTRIBUTE_STRENGTH: AttributeStrength = "normal";

// State type for the attribute selection UI
type AffectedAttributeSelectionState = {
  availableAttributes: Attribute[];
  selectedAttributes: AffectedAttribute[];
  currentAttributeName: string;
  currentAttributeStrength: AttributeStrength;
  noAttributesAvailableText: string;
};

// Action types for managing attribute selection state
type AffectedAttributeSelectionAction =
  | { type: "SET_CURRENT_ATTRIBUTE_NAME"; payload: string }
  | { type: "SET_ATTRIBUTE_STRENGTH"; payload: AttributeStrength }
  | {
      type: "ADD_AFFECTED_ATTRIBUTE";
      payload: Attribute[];
    }
  | {
      type: "DELETE_AFFECTED_ATTRIBUTE";
      payload: {
        affectedAttributeName: string;
        allAttributes: Attribute[];
      };
    }
  | {
      type: "RESET_AFFECTED_ATTRIBUTE_SELECTION_UI";
      payload: Attribute[];
    }
  | {
      type: "SYNC_AFFECTED_ATTRIBUTES_WITH_ALL_AVAILABLE_ATTRIBUTES";
      payload: Attribute[];
    };

// Helper to get available attributes by excluding selected ones
const getAvailableAttributes = (
  attributes: Attribute[],
  selectedAttributes: AffectedAttribute[]
): Attribute[] => {
  const selectedNames = new Set(selectedAttributes.map((attr) => attr.name));
  return attributes.filter((attr) => !selectedNames.has(attr.name));
};

// Helper to sort attributes by their order property
const sortAttributesByOrderInPlace = (attributes: Attribute[]): void => {
  attributes.sort((a, b) => a.order - b.order);
};

// Reducer function to manage attribute selection state
const affectedAttributeSelectionReducer = (
  state: AffectedAttributeSelectionState,
  action: AffectedAttributeSelectionAction
): AffectedAttributeSelectionState => {
  switch (action.type) {
    case "SET_CURRENT_ATTRIBUTE_NAME":
      return { ...state, currentAttributeName: action.payload };
    case "SET_ATTRIBUTE_STRENGTH":
      return { ...state, currentAttributeStrength: action.payload };
    case "ADD_AFFECTED_ATTRIBUTE": {
      const allAvailableAttributes = action.payload;
      const {
        currentAttributeName,
        currentAttributeStrength,
        noAttributesAvailableText,
        selectedAttributes,
      } = state;
      // Prevent adding if no attribute selected or already added
      if (
        currentAttributeName === noAttributesAvailableText ||
        selectedAttributes.some((attr) => attr.name === currentAttributeName)
      ) {
        return state;
      }

      // Add new affected attribute to selected list
      const updatedSelectedAttributes = [
        ...selectedAttributes,
        createAffectedAttribute(currentAttributeName, currentAttributeStrength),
      ];

      // Update available attributes by removing the newly selected one
      const updatedAvailableAttributes = getAvailableAttributes(
        allAvailableAttributes,
        updatedSelectedAttributes
      );
      sortAttributesByOrderInPlace(updatedAvailableAttributes);

      return {
        ...state,
        selectedAttributes: updatedSelectedAttributes,
        availableAttributes: updatedAvailableAttributes,
        currentAttributeName:
          updatedAvailableAttributes[0]?.name || noAttributesAvailableText,
        currentAttributeStrength: DEFAULT_ATTRIBUTE_STRENGTH,
      };
    }
    case "DELETE_AFFECTED_ATTRIBUTE": {
      const { affectedAttributeName, allAttributes } = action.payload;
      const {
        noAttributesAvailableText,
        currentAttributeName,
        selectedAttributes,
      } = state;
      // Remove the specified attribute from the selected list
      const updatedSelectedAttributes = selectedAttributes.filter(
        (attr) => attr.name !== affectedAttributeName
      );
      // Update available attributes by adding back the removed attribute
      const updatedAvailableAttributes = getAvailableAttributes(
        allAttributes,
        updatedSelectedAttributes
      );
      sortAttributesByOrderInPlace(updatedAvailableAttributes);
      return {
        ...state,
        selectedAttributes: updatedSelectedAttributes,
        availableAttributes: updatedAvailableAttributes,
        // If no attributes were available, set current to the newly available (deleted) attribute
        currentAttributeName:
          currentAttributeName === noAttributesAvailableText
            ? affectedAttributeName
            : currentAttributeName,
      };
    }
    case "RESET_AFFECTED_ATTRIBUTE_SELECTION_UI": {
      const attributes = action.payload;
      return {
        noAttributesAvailableText: state.noAttributesAvailableText,
        availableAttributes: attributes,
        selectedAttributes: [],
        currentAttributeName:
          attributes[0]?.name || state.noAttributesAvailableText,
        currentAttributeStrength: DEFAULT_ATTRIBUTE_STRENGTH,
      };
    }
    case "SYNC_AFFECTED_ATTRIBUTES_WITH_ALL_AVAILABLE_ATTRIBUTES": {
      const newAttributes = action.payload;
      const {
        currentAttributeName,
        selectedAttributes,
        noAttributesAvailableText,
      } = state;
      // Validate selected attributes still exist in the new attributes list
      const validSelectedAttributes = selectedAttributes.filter((attr) =>
        newAttributes.some((a) => a.name === attr.name)
      );

      // Update available attributes accordingly
      const updatedAvailableAttributes = getAvailableAttributes(
        newAttributes,
        validSelectedAttributes
      );

      let updatedCurrentAttributeName = currentAttributeName;
      // Update current attribute name if it's no longer available
      if (
        updatedCurrentAttributeName !== noAttributesAvailableText &&
        !updatedAvailableAttributes.some(
          (attr) => attr.name === updatedCurrentAttributeName
        )
      ) {
        updatedCurrentAttributeName =
          updatedAvailableAttributes[0]?.name || noAttributesAvailableText;
      }
      // If current attribute is the no-attributes text and there are available attributes, set to first available
      if (
        updatedAvailableAttributes.length &&
        updatedCurrentAttributeName === noAttributesAvailableText
      ) {
        updatedCurrentAttributeName = updatedAvailableAttributes[0].name;
      }

      return {
        ...state,
        availableAttributes: updatedAvailableAttributes,
        selectedAttributes: validSelectedAttributes,
        currentAttributeName: updatedCurrentAttributeName,
      };
    }
    default:
      return state;
  }
};

/**
 * Manages the selection and configuration of attributes that affect game mechanics.
 *
 * @typedef {Object} AffectedAttributeManager
 * @property {Attribute[]} availableAttributes - List of all attributes available for selection
 * @property {AffectedAttribute[]} selectedAttributes - Currently selected attributes and their configurations
 * @property {string} currentAttributeName - Name of the attribute currently being configured
 * @property {AttributeStrength} currentAttributeStrength - Strength level of the attribute being configured
 * @property {string} noAttributesAvailableText - Message to display when no attributes are available
 * @property {Object} actions - Collection of action handlers for attribute management
 * @property {function(string): void} actions.setCurrentAttributeName - Updates the name of the attribute being configured
 * @property {function(AttributeStrength): void} actions.setAttributeStrength - Updates the strength of the attribute being configured
 * @property {function(): void} actions.addAffectedAttribute - Adds the currently configured attribute to the selection
 * @property {function(string): void} actions.deleteAffectedAttribute - Removes an attribute from the selection by name
 * @property {function(): void} actions.resetAffectedAttributeSelectionUI - Resets the attribute selection interface to its initial state
 * @property {function(Attribute[]): void} actions.syncAffectedAttributesWithAllAvailableAttributes - Synchronizes affected attributes with an updated list of available attributes
 */
export type AffectedAttributeManager = {
  availableAttributes: Attribute[];
  selectedAttributes: AffectedAttribute[];
  currentAttributeName: string;
  currentAttributeStrength: AttributeStrength;
  noAttributesAvailableText: string;
  actions: {
    setCurrentAttributeName: (newAttributeName: string) => void;
    setAttributeStrength: (newAttributeStrength: AttributeStrength) => void;
    addAffectedAttribute: () => void;
    deleteAffectedAttribute: (name: string) => void;
    resetAffectedAttributeSelectionUI: () => void;
    syncAffectedAttributesWithAllAvailableAttributes: (
      attributes: Attribute[]
    ) => void;
  };
};

/**
 * Hook for managing the selection and configuration of affected attributes.
 *
 * Provides state management for selecting attributes, setting their strength values,
 * and maintaining a list of affected attributes with various operations.
 *
 * Automatically synchronizes affected attributes whenever the available attributes change
 * via an internal useEffect hook, ensuring selected attributes remain valid when the
 * attributes list is updated externally.
 *
 * @param attributes - Array of available attributes to select from. Expected to be pre-sorted by order.
 * @param noAttributesAvailableText - Fallback text to display when no attributes are available
 *
 * @returns Object containing:
 *   - availableAttributes: Array of all available attributes
 *   - selectedAttributes: Array of currently selected affected attributes
 *   - currentAttributeName: Name of the currently selected attribute
 *   - currentAttributeStrength: Strength value of the current attribute
 *   - noAttributesAvailableText: Fallback text for empty state
 *   - actions: Object with the following methods:
 *     - setCurrentAttributeName: Updates the currently selected attribute name
 *     - setAttributeStrength: Updates the strength value of the current attribute
 *     - addAffectedAttribute: Adds the current attribute to the affected attributes list
 *     - deleteAffectedAttribute: Removes an affected attribute by name
 *     - resetAffectedAttributeSelectionUI: Resets the selection UI to initial state
 *     - syncAffectedAttributesWithAllAvailableAttributes: Manually synchronizes affected attributes with updated available attributes
 *
 * @remarks
 * The hook automatically calls syncAffectedAttributesWithAllAvailableAttributes whenever
 * the attributes parameter changes, so manual calls are typically unnecessary unless you need
 * to update attributes outside of the hook's parameters.
 */
const useAffectedAttributeManager = (
  attributes: Attribute[],
  noAttributesAvailableText: string
): AffectedAttributeManager => {
  const initialState: AffectedAttributeSelectionState = {
    availableAttributes: attributes,
    selectedAttributes: [],
    currentAttributeName: attributes[0]?.name || noAttributesAvailableText,
    currentAttributeStrength: DEFAULT_ATTRIBUTE_STRENGTH,
    noAttributesAvailableText,
  };
  const [state, dispatch] = useReducer(
    affectedAttributeSelectionReducer,
    initialState
  );

  useEffect(() => {
    dispatch({
      type: "SYNC_AFFECTED_ATTRIBUTES_WITH_ALL_AVAILABLE_ATTRIBUTES",
      payload: attributes,
    });
  }, [attributes]);

  const actions = useMemo(
    () => ({
      setCurrentAttributeName: (newAttributeName: string) => {
        dispatch({
          type: "SET_CURRENT_ATTRIBUTE_NAME",
          payload: newAttributeName,
        });
      },
      setAttributeStrength: (newAttributeStrength: AttributeStrength) => {
        dispatch({
          type: "SET_ATTRIBUTE_STRENGTH",
          payload: newAttributeStrength,
        });
      },
      addAffectedAttribute: () => {
        dispatch({
          type: "ADD_AFFECTED_ATTRIBUTE",
          payload: attributes,
        });
      },
      deleteAffectedAttribute: (name: string) => {
        dispatch({
          type: "DELETE_AFFECTED_ATTRIBUTE",
          payload: {
            affectedAttributeName: name,
            allAttributes: attributes,
          },
        });
      },
      resetAffectedAttributeSelectionUI: () => {
        dispatch({
          type: "RESET_AFFECTED_ATTRIBUTE_SELECTION_UI",
          payload: attributes,
        });
      },
      syncAffectedAttributesWithAllAvailableAttributes: (
        newAttributes: Attribute[]
      ) => {
        dispatch({
          type: "SYNC_AFFECTED_ATTRIBUTES_WITH_ALL_AVAILABLE_ATTRIBUTES",
          payload: newAttributes,
        });
      },
    }),
    [attributes]
  );

  return {
    ...state,
    actions,
  };
};

export default useAffectedAttributeManager;
