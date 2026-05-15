import { useReducer } from "react";
import { DailyQuest } from "../types/DailyQuest";
import completeQuestDB from "@/app/queries/client/completeQuest";
import undoCompleteQuestDB from "@/app/queries/client/undoCompleteQuest";

interface DailyQuestState {
  dailyQuests: DailyQuest[];
  errors: string[]; // Consider more robust error handling strategy in the future (e.g. mapping questId to error message, etc.)
}

type DailyQuestAction =
  | { type: "submitCompleteQuest"; questId: number }
  | { type: "completeQuestSuccess"; questId: number; completedQuestId: number }
  | { type: "completeQuestFailure"; questId: number }
  | { type: "undoCompleteQuest"; questId: number }
  | { type: "undoCompleteQuestSuccess"; questId: number }
  | { type: "undoCompleteQuestFailure"; questId: number };

/**
 * Reducer function for managing daily quest state.
 *
 * @param state - The current daily quest state
 * @param action - The action to be processed
 * @returns {DailyQuestState} The updated daily quest state
 *
 * @remarks
 * Handles the following actions:
 * - `submitCompleteQuest`: Marks a quest as pending while submission is in progress
 * - `completeQuestSuccess`: Marks a quest as completed and stores the completed quest ID
 * - `completeQuestFailure`: Reverts quest to uncompleted state and adds error message
 * - `undoCompleteQuest`: Marks a quest as pending while undo is in progress
 * - `undoCompleteQuestSuccess`: Reverts a completed quest back to uncompleted state
 * - `undoCompleteQuestFailure`: Reverts quest to completed state and adds error message
 */
function dailyQuestReducer(
  state: DailyQuestState,
  action: DailyQuestAction,
): DailyQuestState {
  switch (action.type) {
    case "submitCompleteQuest": {
      const { questId } = action;
      // Update local state to pending immediately for better UX
      return {
        ...state,
        dailyQuests: state.dailyQuests.map((quest) =>
          quest.id === questId ? { ...quest, isCompleted: "pending" } : quest,
        ),
      };
    }
    case "completeQuestSuccess": {
      const { questId, completedQuestId } = action;
      return {
        ...state,
        dailyQuests: state.dailyQuests.map((quest) =>
          quest.id === questId
            ? { ...quest, isCompleted: "true", completedQuestId }
            : quest,
        ),
        errors: [],
      };
    }
    case "completeQuestFailure": {
      const { questId } = action;
      let questName;
      return {
        ...state,
        dailyQuests: state.dailyQuests.map((quest) => {
          if (quest.id === questId) {
            questName = quest.name;
            return { ...quest, isCompleted: "false" };
          } else {
            return quest;
          }
        }),
        errors: [
          ...state.errors,
          `Failed to complete quest "${questName}". Please try again.`,
        ],
      };
    }
    case "undoCompleteQuest": {
      const { questId } = action;
      return {
        ...state,
        dailyQuests: state.dailyQuests.map((quest) =>
          quest.id === questId ? { ...quest, isCompleted: "pending" } : quest,
        ),
      };
    }
    case "undoCompleteQuestSuccess": {
      const { questId } = action;
      return {
        ...state,
        dailyQuests: state.dailyQuests.map((quest) =>
          quest.id === questId
            ? { ...quest, isCompleted: "false", completedQuestId: null }
            : quest,
        ),
        errors: [],
      };
    }
    case "undoCompleteQuestFailure": {
      const { questId } = action;
      let questName;
      return {
        ...state,
        dailyQuests: state.dailyQuests.map((quest) => {
          if (quest.id === questId) {
            questName = quest.name;
            return { ...quest, isCompleted: "true" };
          } else {
            return quest;
          }
        }),
        errors: [
          ...state.errors,
          `Failed to undo completion of quest "${questName}". Please try again.`,
        ],
      };
    }
    default:
      throw new Error(`Unhandled action type in dailyQuestReducer.`);
  }
}

export interface DailyQuestManager {
  dailyQuests: DailyQuest[];
  actions: {
    completeQuest: (questId: number) => void;
    undoCompleteQuest: (questId: number, completedQuestId: number) => void;
  };
  errors: string[];
}

/**
 * Manages daily quest state and operations.
 *
 * @param dailyQuests - Array of daily quests to initialize the hook with
 * @returns {DailyQuestManager} Object containing the current quests, action handlers, and any errors
 *
 * @example
 * ```tsx
 * const { dailyQuests, actions, errors } = useDailyQuestManager(quests);
 *
 * // Complete a quest
 * await actions.completeQuest(questId);
 *
 * // Undo a quest completion
 * await actions.undoCompleteQuest(questId, completedQuestId);
 * ```
 */
export default function useDailyQuestManager(
  dailyQuests: DailyQuest[],
): DailyQuestManager {
  const [state, dispatch] = useReducer(dailyQuestReducer, {
    dailyQuests,
    errors: [],
  });

  const completeQuest = async (questId: number) => {
    // Update local state with pending status immediately
    dispatch({ type: "submitCompleteQuest", questId });
    try {
      const completedQuestId = await completeQuestDB(questId);
      dispatch({ type: "completeQuestSuccess", questId, completedQuestId });
    } catch (error) {
      console.error("Error completing quest:", error);
      dispatch({ type: "completeQuestFailure", questId });
    }
  };
  const undoCompleteQuest = async (
    questId: number,
    completedQuestId: number,
  ) => {
    // Update local state to pending immediately for better UX,
    // then write to database to undo quest completion for the day
    dispatch({ type: "undoCompleteQuest", questId });
    try {
      await undoCompleteQuestDB(completedQuestId);
      dispatch({ type: "undoCompleteQuestSuccess", questId });
    } catch (error) {
      console.error("Error undoing quest completion:", error);
      dispatch({ type: "undoCompleteQuestFailure", questId });
    }
  };

  return {
    dailyQuests: state.dailyQuests,
    actions: {
      completeQuest,
      undoCompleteQuest,
    },
    errors: state.errors,
  };
}
