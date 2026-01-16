import { useReducer, useMemo, useEffect, useRef } from "react";
import { Attribute, Quest } from "@/utils/types/AttributesAndQuests";

// TODO: add structured logging

// Total experience points available for allocation across all quests
const TOTAL_EXPERIENCE_POINTS = 100;

/**
 * Represents the state of quests in the application.
 * @interface QuestState
 * @property {Quest[]} quests - Array of quest objects managed by the application.
 * @property {number} pointsRemaining - The number of points available for quest allocation.
 */
interface QuestState {
  quests: Quest[];
  pointsRemaining: number;
}

/**
 * Represents the possible actions that can be performed on QuestState.
 */
type QuestAction =
  | { type: "ADD_QUEST"; payload: Quest }
  | { type: "DELETE_QUEST"; payload: Quest }
  | {
      type: "CHANGE_QUEST_ORDER";
      payload: { quest: Quest; direction: "up" | "down" };
    }
  | {
      type: "CHANGE_QUEST_EXPERIENCE";
      payload: { quest: Quest; direction: "up" | "down" };
    }
  | {
      type: "REMOVE_UNAVAILABLE_AFFECTED_ATTRIBUTES";
      payload: Set<string>;
    };

/**
 * Reducer function for managing quest state transitions.
 * Handles adding, deleting, reordering, and adjusting experience points for quests.
 *
 * @param state - The current quest state containing quests array and metadata
 * @param action - The action object describing the state mutation to perform
 * @param action.type - The type of action: "ADD_QUEST" | "DELETE_QUEST" | "CHANGE_QUEST_ORDER" | "CHANGE_QUEST_EXPERIENCE" | "REMOVE_UNAVAILABLE_AFFECTED_ATTRIBUTES"
 * @param action.payload - The payload data specific to the action type
 *
 * @returns {QuestState} The updated quest state after applying the action
 *
 * @throws {Error} When an unhandled action type is provided
 *
 * @example
 * // Add a new quest
 * const newState = questReducer(state, {
 *   type: "ADD_QUEST",
 *   payload: newQuest
 * });
 *
 * @example
 * // Change quest order
 * const newState = questReducer(state, {
 *   type: "CHANGE_QUEST_ORDER",
 *   payload: { quest, direction: "up" }
 * });
 */
function questReducer(state: QuestState, action: QuestAction): QuestState {
  switch (action.type) {
    case "ADD_QUEST": {
      const newQuest = action.payload;
      // Note: duplicates should be prevented by the UI, but adding a safeguard here as well
      if (state.quests.some((quest) => quest.name === newQuest.name)) {
        console.warn("Quest with this name already exists");
        return state; // Prevent adding duplicate quest names
      }
      if (newQuest.experiencePointValue > state.pointsRemaining) {
        console.warn(
          "Not enough points remaining to add quest with experience points"
        );
        return state;
      }
      return {
        ...state,
        quests: [...state.quests, newQuest],
        pointsRemaining: state.pointsRemaining - newQuest.experiencePointValue,
      };
    }
    case "DELETE_QUEST": {
      const {
        name: deletedQuestName,
        experiencePointValue: deletedQuestExperiencePoints,
      } = action.payload;
      const updatedQuests = state.quests.filter(
        (quest) => quest.name !== deletedQuestName
      );
      if (state.quests.length === updatedQuests.length) {
        console.warn("Attempted to delete a quest that does not exist");
        return state; // Quest not found, no changes
      }
      return {
        ...state,
        quests: updatedQuests,
        pointsRemaining: state.pointsRemaining + deletedQuestExperiencePoints,
      };
    }
    case "CHANGE_QUEST_ORDER": {
      const { quest, direction } = action.payload;
      const index = state.quests.findIndex((q) => q.name === quest.name);
      if (index === -1) {
        console.warn(
          "Attempted to change order of a quest that does not exist"
        );
        return state;
      }

      const swapIndex = direction === "up" ? index - 1 : index + 1;
      const canSwap =
        (direction === "up" && index > 0) ||
        (direction === "down" && index < state.quests.length - 1);

      if (canSwap) {
        const updatedQuests = [...state.quests];
        [updatedQuests[swapIndex], updatedQuests[index]] = [
          updatedQuests[index],
          updatedQuests[swapIndex],
        ];
        return { ...state, quests: updatedQuests };
      }

      // No change if at boundaries and no swap occurs
      return state;
    }
    case "CHANGE_QUEST_EXPERIENCE": {
      const { quest, direction } = action.payload;
      // Prevent increasing beyond available points or decreasing below 0
      if (direction === "up" && state.pointsRemaining <= 0) return state;

      // Use quest in state to prevent usage of stale data
      const targetQuest = state.quests.find((q) => q.name === quest.name);
      if (!targetQuest) {
        console.warn(
          "Attempted to change experience of a quest that does not exist"
        );
        return state;
      }

      // Prevent decreasing below 0
      if (direction === "down" && targetQuest.experiencePointValue <= 0) {
        return state;
      }
      const experienceChange = direction === "up" ? 1 : -1;
      const updatedQuest = {
        ...targetQuest,
        experiencePointValue:
          targetQuest.experiencePointValue + experienceChange,
      };
      // Update experience point value
      const updatedQuests = state.quests.map((quest) =>
        quest.name === targetQuest.name ? updatedQuest : quest
      );

      return {
        ...state,
        quests: updatedQuests,
        pointsRemaining: state.pointsRemaining + (direction === "up" ? -1 : 1),
      };
    }
    case "REMOVE_UNAVAILABLE_AFFECTED_ATTRIBUTES": {
      const availableAttributesSet = action.payload;
      let attributeRemoved = false;
      const updatedQuests = state.quests.map((quest) => {
        const filteredAttributes = quest.affectedAttributes.filter((attr) => availableAttributesSet.has(attr.name));
        if (filteredAttributes.length !== quest.affectedAttributes.length) {
          attributeRemoved = true;
          return { ...quest, affectedAttributes: filteredAttributes };
        }
        return quest;
      });
      if (!attributeRemoved) {
        return state; // No changes needed
      }
      return {
        ...state,
        quests: updatedQuests,
      };
    }
    default:
      throw new Error("Unhandled action type in questReducer");
  }
}

/**
 * Return type for the useQuestManager hook
 * @interface QuestManager
 * @property {Quest[]} quests - Array of quest objects
 * @property {number} pointsRemaining - The number of experience points available to allocate
 * @property {Object} actions - Object containing quest management action handlers
 * @property {(quest: Quest) => void} actions.addQuest - Adds a new quest to the list
 * @property {(quest: Quest) => void} actions.deleteQuest - Removes a quest from the list
 * @property {(quest: Quest, direction: "up" | "down") => void} actions.questOrderChange - Moves a quest up or down in the order
 * @property {(quest: Quest, direction: "up" | "down") => void} actions.experiencePointValueChange - Adjusts the experience point value of a quest
 */
interface QuestManager {
  quests: Quest[];
  pointsRemaining: number;
  actions: {
    addQuest: (quest: Quest) => void;
    deleteQuest: (quest: Quest) => void;
    questOrderChange: (quest: Quest, direction: "up" | "down") => void;
    experiencePointValueChange: (
      quest: Quest,
      direction: "up" | "down"
    ) => void;
  };
}

/**
 * Hook for managing quest setup state and operations.
 *
 * Provides centralized state management for quests including creation, deletion,
 * ordering, and experience point adjustments. Uses a reducer pattern to handle
 * state transitions. Also ensures quests remain consistent with available attributes.
 *
 * @returns {QuestManager} An object containing:
 *   - `quests`: Array of current quests
 *   - `pointsRemaining`: Remaining experience points available to allocate
 *   - `actions`: Object containing action creators:
 *     - `addQuest`: Adds a new quest to the state
 *     - `deleteQuest`: Removes a quest from the state
 *     - `questOrderChange`: Moves a quest up or down in the list
 *     - `experiencePointValueChange`: Adjusts a quest's experience point value
 *
 * @example
 * const { quests, pointsRemaining, actions } = useQuestManager();
 * actions.addQuest(newQuest);
 * actions.questOrderChange(quest, 'up');
 */
export default function useQuestManager(
  availableAttributes: Attribute[]
): QuestManager {
  const [state, dispatch] = useReducer(questReducer, {
    quests: [],
    pointsRemaining: TOTAL_EXPERIENCE_POINTS,
  });
  const attributesLengthRef = useRef(availableAttributes.length);

  // Ensure that quests do not reference attributes that are no longer available
  useEffect(() => {
    // Prevent running when attributes are added
    if (attributesLengthRef.current < availableAttributes.length) {
      attributesLengthRef.current = availableAttributes.length;
      return;
    }
    attributesLengthRef.current = availableAttributes.length;
    const attributesSet = new Set(availableAttributes.map((attr) => attr.name));
    dispatch({
      type: "REMOVE_UNAVAILABLE_AFFECTED_ATTRIBUTES",
      payload: attributesSet,
    });
  }, [availableAttributes]);

  const actions = useMemo(
    () => ({
      addQuest: (quest: Quest) => {
        dispatch({ type: "ADD_QUEST", payload: quest });
      },
      deleteQuest: (quest: Quest) => {
        dispatch({ type: "DELETE_QUEST", payload: quest });
      },
      questOrderChange: (quest: Quest, direction: "up" | "down") => {
        dispatch({ type: "CHANGE_QUEST_ORDER", payload: { quest, direction } });
      },
      experiencePointValueChange: (quest: Quest, direction: "up" | "down") => {
        dispatch({
          type: "CHANGE_QUEST_EXPERIENCE",
          payload: { quest, direction },
        });
      },
    }),
    []
  );

  return {
    ...state,
    actions,
  };
}
