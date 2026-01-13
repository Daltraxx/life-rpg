import { useReducer } from "react";
import { Quest } from "../classesAndInterfaces/AttributesAndQuests";

// TODO: add structured logging

// Total experience points available for allocation across all quests
const TOTAL_EXPERIENCE_POINTS = 100;

/**
 * Represents the state of quests in the application.
 * @interface QuestState
 * @property {Quest[]} quests - Array of quest objects managed by the application.
 * @property {number} nextQuestOrderNumber - The order number to be assigned to the next quest.
 * @property {number} pointsRemaining - The number of points available for quest allocation.
 */
interface QuestState {
  quests: Quest[];
  nextQuestOrderNumber: number;
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
      // TODO: Consider handling quest order here, or keep in Quest Widget?
      const newQuest = action.payload;
      // Note: duplicates should be prevented by the UI, but adding a safeguard here as well
      if (state.quests.some((quest) => quest.name === newQuest.name)) {
        console.warn("Quest with this name already exists");
        return state; // Prevent adding duplicate quest names
      }
      return {
        ...state,
        quests: [...state.quests, newQuest],
        nextQuestOrderNumber: state.nextQuestOrderNumber + 1,
      };
    }
    case "DELETE_QUEST": {
      const deletedQuest = action.payload;
      const existingQuest = state.quests.find(
        (quest) => quest.name === deletedQuest.name
      );
      if (!existingQuest) {
        console.warn("Attempted to delete a quest that does not exist");
        return state; // Quest not found, no changes
      }
      const deletedQuestIndex = existingQuest.order;
      const updatedQuests = state.quests.filter(
        (quest) => quest.name !== deletedQuest.name
      );
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
        nextQuestOrderNumber: state.nextQuestOrderNumber - 1,
        pointsRemaining:
          state.pointsRemaining + deletedQuest.experiencePointValue,
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

      if (direction === "up" && index > 0) {
        // Swap with the quest above
        const updatedQuests = structuredClone(state.quests);
        [updatedQuests[index - 1], updatedQuests[index]] = [
          updatedQuests[index],
          updatedQuests[index - 1],
        ];
        // Update order numbers
        updatedQuests[index - 1].order = index - 1;
        updatedQuests[index].order = index;
        return {
          ...state,
          quests: updatedQuests,
        };
      } else if (direction === "down" && index < state.quests.length - 1) {
        // Swap with the quest below
        const updatedQuests = structuredClone(state.quests);
        [updatedQuests[index + 1], updatedQuests[index]] = [
          updatedQuests[index],
          updatedQuests[index + 1],
        ];
        // Update order numbers
        updatedQuests[index + 1].order = index + 1;
        updatedQuests[index].order = index;
        return {
          ...state,
          quests: updatedQuests,
        };
      }

      // No change if at boundaries and no swap occurs
      return state;
    }
    case "CHANGE_QUEST_EXPERIENCE": {
      const { quest, direction } = action.payload;
      if (direction === "up" && state.pointsRemaining <= 0) return state;
      // Double conditional check on "down" to prevent going below 0 when button is held
      if (
        (direction === "down" && quest.experiencePointValue <= 0) ||
        (direction === "down" &&
          state.pointsRemaining >= TOTAL_EXPERIENCE_POINTS)
      ) {
        return state;
      }
      const updatedQuests = structuredClone(state.quests);
      let questToUpdate = updatedQuests[quest.order];
      // Fallback in case the order index is out of sync. Should not happen.
      if (!questToUpdate || questToUpdate.name !== quest.name) {
        console.warn(
          "Quest order index out of sync. Searching by name as fallback."
        );
        questToUpdate = updatedQuests.find(
          (q) => q.name === quest.name
        ) as Quest;
        if (!questToUpdate)
          throw new Error("Quest not found in state during experience update");
      }
      questToUpdate.experiencePointValue += direction === "up" ? 1 : -1;
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
 * @property {number} nextQuestOrderNumber - The next sequential order number for a new quest
 * @property {number} pointsRemaining - The number of experience points available to allocate
 * @property {Object} actions - Object containing quest management action handlers
 * @property {(quest: Quest) => void} actions.addQuest - Adds a new quest to the list
 * @property {(quest: Quest) => void} actions.deleteQuest - Removes a quest from the list
 * @property {(quest: Quest, direction: "up" | "down") => void} actions.questOrderChange - Moves a quest up or down in the order
 * @property {(quest: Quest, direction: "up" | "down") => void} actions.experiencePointValueChange - Adjusts the experience point value of a quest
 */
interface QuestManager {
  quests: Quest[];
  nextQuestOrderNumber: number;
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
 *   - `nextQuestOrderNumber`: The next available order number for new quests
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
    nextQuestOrderNumber: 0,
    pointsRemaining: TOTAL_EXPERIENCE_POINTS,
  });

  return {
    ...state,
    actions: {
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
    },
  };
}
