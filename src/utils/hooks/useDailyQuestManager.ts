import { useReducer } from "react";
import { DailyQuest } from "../types/DailyQuest";
import completeQuestDB from "@/app/queries/client/completeQuest";

interface DailyQuestState {
  dailyQuests: DailyQuest[];
  errors: String[]; // Consider more robust error handling strategy in the future (e.g. mapping questId to error message, etc.)
}

type DailyQuestAction =
  | { type: "submitCompleteQuest"; questId: number }
  | { type: "completeQuestSuccess"; questId: number; completedQuestId: number }
  | { type: "completeQuestFailure"; questId: number }
  | { type: "undoCompleteQuest"; questId: number };

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
            ? { ...quest, isCompleted: true, completedQuestId }
            : quest,
        ),
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
            return { ...quest, isCompleted: false };
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
      // Write to database to undo quest completion for the day (TODO: implement)
      return {
        ...state,
        dailyQuests: state.dailyQuests.map((quest) =>
          quest.id === questId ? { ...quest, isCompleted: false } : quest,
        ),
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
    undoCompleteQuest: (questId: number) => void;
  };
  errors: String[];
}

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
  const undoCompleteQuest = (questId: number) => {
    dispatch({ type: "undoCompleteQuest", questId });
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
