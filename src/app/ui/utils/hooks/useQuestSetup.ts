import { useReducer } from "react";
import { Quest } from "../classesAndInterfaces/AttributesAndQuests";

/**
 * Represents the possible actions that can be performed on quests.
 *
 * @typedef {Object} QuestAction
 * @property {Object} ADD_QUEST - Adds a new quest to the collection
 * @property {Quest} ADD_QUEST.payload - The quest to be added
 *
 * @property {Object} DELETE_QUEST - Removes a quest from the collection
 * @property {Quest} DELETE_QUEST.payload - The quest to be deleted
 *
 * @property {Object} CHANGE_QUEST_ORDER - Reorders a quest in the collection
 * @property {Quest} CHANGE_QUEST_ORDER.payload.quest - The quest to be reordered
 * @property {"up" | "down"} CHANGE_QUEST_ORDER.payload.direction - The direction to move the quest
 *
 * @property {Object} CHANGE_QUEST_EXPERIENCE - Modifies the experience value of a quest
 * @property {Quest} CHANGE_QUEST_EXPERIENCE.payload.quest - The quest to adjust
 * @property {"up" | "down"} CHANGE_QUEST_EXPERIENCE.payload.direction - The direction to adjust experience (increase or decrease)
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
      const newQuest = action.payload;
      return {
        ...state,
        quests: [...state.quests, newQuest],
        nextQuestOrderNumber: state.nextQuestOrderNumber + 1,
      };
    }
    case "DELETE_QUEST": {
      const deletedQuest = action.payload;
      const updatedQuests = structuredClone(state.quests).filter(
        (quest) => deletedQuest.name !== quest.name
      );
      // Only update state if quest was actually deleted
      if (updatedQuests.length === state.quests.length) {
        console.warn("Attempted to delete a quest that does not exist");
        return state; // Quest not found, no changes
      }
      const deletedQuestIndex = deletedQuest.order;
      updatedQuests.forEach((quest) => {
        if (quest.order > deletedQuestIndex) {
          quest.order -= 1;
        }
      });
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

      const updatedQuests = structuredClone(state.quests);
      if (direction === "up" && index > 0) {
        // Swap with the quest above
        [updatedQuests[index - 1], updatedQuests[index]] = [
          updatedQuests[index],
          updatedQuests[index - 1],
        ];
        // Update order numbers
        updatedQuests[index - 1].order = index - 1;
        updatedQuests[index].order = index;
      } else if (direction === "down" && index < state.quests.length - 1) {
        // Swap with the quest below
        [updatedQuests[index + 1], updatedQuests[index]] = [
          updatedQuests[index],
          updatedQuests[index + 1],
        ];
        // Update order numbers
        updatedQuests[index + 1].order = index + 1;
        updatedQuests[index].order = index;
      }
      return {
        ...state,
        quests: updatedQuests,
      };
    }
    case "CHANGE_QUEST_EXPERIENCE": {
      const { quest, direction } = action.payload;
      if (direction === "up" && state.pointsRemaining <= 0) return state;
      if (direction === "down" && quest.experiencePointValue <= 0) return state;
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
 * Return type for the useQuestSetup hook
 * @interface UseQuestSetupReturn
 * @property {Quest[]} quests - Array of quest objects
 * @property {number} nextQuestOrderNumber - The next sequential order number for a new quest
 * @property {number} pointsRemaining - The number of experience points available to allocate
 * @property {Object} actions - Object containing quest management action handlers
 * @property {(quest: Quest) => void} actions.addQuest - Adds a new quest to the list
 * @property {(quest: Quest) => void} actions.deleteQuest - Removes a quest from the list
 * @property {(quest: Quest, direction: "up" | "down") => void} actions.questOrderChange - Moves a quest up or down in the order
 * @property {(quest: Quest, direction: "up" | "down") => void} actions.experiencePointValueChange - Adjusts the experience point value of a quest
 */
interface UseQuestSetupReturn {
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
 * @returns {UseQuestSetupReturn} An object containing:
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
 * const { quests, pointsRemaining, actions } = useQuestSetup();
 * actions.addQuest(newQuest);
 * actions.questOrderChange(quest, 'up');
 */
export default function useQuestSetup(): UseQuestSetupReturn {
  const [state, dispatch] = useReducer(questReducer, {
    quests: [],
    nextQuestOrderNumber: 0,
    pointsRemaining: 100,
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
