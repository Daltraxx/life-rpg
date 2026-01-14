import { useReducer, useMemo } from "react";
import { Quest } from "../classesAndInterfaces/AttributesAndQuests";

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
    };

/**
 * Reducer function for managing quest state transitions.
 * Handles adding, deleting, reordering, and adjusting experience points for quests.
 *
 * @param state - The current quest state containing quests array and metadata
 * @param action - The action object describing the state mutation to perform
 * @param action.type - The type of action: "ADD_QUEST" | "DELETE_QUEST" | "CHANGE_QUEST_ORDER" | "CHANGE_QUEST_EXPERIENCE"
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
      // Assign order based on current length
      // (also assigned in the UI, but added here as well as safeguard against state desync)
      const newQuest = { ...action.payload, order: state.quests.length };
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
      const deletedQuest = action.payload;
      let exists = false;
      let deletedQuestIndex = -1;
      let deletedQuestExperiencePoints = 0;
      const updatedQuests = state.quests.filter((quest, index) => {
        if (quest.name === deletedQuest.name) {
          exists = true;
          deletedQuestIndex = index;
          deletedQuestExperiencePoints = quest.experiencePointValue;
          return false;
        }
        return true;
      });
      if (!exists) {
        console.warn("Attempted to delete a quest that does not exist");
        return state; // Quest not found, no changes
      }
      if (deletedQuestIndex !== deletedQuest.order) {
        console.warn(
          "Quest order index out of sync during deletion. Using found index."
        );
      }
      // Reorder remaining quests
      for (let i = deletedQuestIndex; i < updatedQuests.length; i++) {
        updatedQuests[i] = {
          ...updatedQuests[i],
          order: updatedQuests[i].order - 1,
        };
      }
      return {
        ...state,
        quests: updatedQuests,
        pointsRemaining: state.pointsRemaining + deletedQuestExperiencePoints,
      };
    }
    case "CHANGE_QUEST_ORDER": {
      const { quest, direction } = action.payload;
      let index = quest.order;
      if (
        index < 0 ||
        index >= state.quests.length ||
        state.quests[index].name !== quest.name
      ) {
        // Fallback in case the order index is out of sync. Should not happen.
        console.warn(
          "Quest order index out of sync. Searching by name as fallback."
        );
        index = state.quests.findIndex((q) => q.name === quest.name);
        if (index === -1) {
          throw new Error("Quest not found in state during order change");
        }
      }

      const swapIndex = direction === "up" ? index - 1 : index + 1;
      const canSwap =
        (direction === "up" && index > 0) ||
        (direction === "down" && index < state.quests.length - 1);

      if (canSwap) {
        const updatedQuests = structuredClone(state.quests);
        [updatedQuests[swapIndex], updatedQuests[index]] = [
          updatedQuests[index],
          updatedQuests[swapIndex],
        ];
        updatedQuests[swapIndex].order = swapIndex;
        updatedQuests[index].order = index;
        return { ...state, quests: updatedQuests };
      }

      // No change if at boundaries and no swap occurs
      return state;
    }
    case "CHANGE_QUEST_EXPERIENCE": {
      const { quest, direction } = action.payload;
      let questIndex = quest.order;
      const targetQuest = state.quests.find((q, index) => {
        if (q.name === quest.name) {
          questIndex = index;
          return true;
        }
      });
      if (!targetQuest) {
        console.warn(
          "Attempted to change experience of a quest that does not exist"
        );
        return state;
      }
       if (questIndex !== quest.order) {
         console.warn(
           "Quest order index out of sync during experience change. Using found index."
         );
       }
      // Prevent increasing beyond available points or decreasing below 0
      if (direction === "up" && state.pointsRemaining <= 0) return state;
      // Prevent decreasing below 0
      if (direction === "down" && targetQuest.experiencePointValue <= 0) {
        return state;
      }

      // Update experience point value
      const updatedQuests = structuredClone(state.quests);
      updatedQuests[questIndex].experiencePointValue +=
        direction === "up" ? 1 : -1;

      return {
        ...state,
        quests: updatedQuests,
        pointsRemaining: state.pointsRemaining + (direction === "up" ? -1 : 1),
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
 * state transitions.
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
export default function useQuestManager(): QuestManager {
  const [state, dispatch] = useReducer(questReducer, {
    quests: [],
    pointsRemaining: TOTAL_EXPERIENCE_POINTS,
  });

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
