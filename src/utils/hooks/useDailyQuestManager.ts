import { useReducer } from 'react';
import { DailyQuest } from '../types/DailyQuest';
import completeQuest from '@/app/queries/client/completeQuest';

interface DailyQuestState {
  dailyQuests: DailyQuest[];
}

type DailyQuestAction =
  | { type: "completeQuest"; questId: number }
  | { type: "undoCompleteQuest"; questId: number };

function dailyQuestReducer(
  state: DailyQuestState,
  action: DailyQuestAction,
): DailyQuestState {
  switch (action.type) {
    case "completeQuest": {
      const { questId } = action;
      // Write to database to mark quest as completed for the day
      // TODO: alert user if there's an error completing the quest (e.g. network error, database error, etc.)
      completeQuest(questId).catch((error) => {
        console.error("Error completing quest:", error);
      });
      return {
        ...state,
        dailyQuests: state.dailyQuests.map((quest) =>
          quest.id === questId ? { ...quest, isCompleted: true } : quest,
        ),
      }
    }
    case "undoCompleteQuest": {
      const { questId } = action;
      // Write to database to undo quest completion for the day (TODO: implement)
      return {
        ...state,
        dailyQuests: state.dailyQuests.map((quest) =>
          quest.id === questId ? { ...quest, isCompleted: false } : quest,
        ),
      }
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
}

export default function useDailyQuestManager(dailyQuests: DailyQuest[]): DailyQuestManager { 
  const [state, dispatch] = useReducer(dailyQuestReducer, { dailyQuests });

  const completeQuest = (questId: number) => {
    dispatch({ type: "completeQuest", questId });
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
  };
}
