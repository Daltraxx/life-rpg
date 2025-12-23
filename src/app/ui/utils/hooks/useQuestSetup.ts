import { useState } from "react";
import { Quest } from "../classesAndInterfaces/AttributesAndQuests";

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
 * Provides state management for quests including adding, deleting, reordering quests,
 * and adjusting experience point distribution across quests with a fixed point pool.
 *
 * @returns {UseQuestSetupReturn} An object containing:
 *   - quests: Array of current quests
 *   - nextQuestOrderNumber: The order number for the next quest to be added
 *   - pointsRemaining: Remaining experience points available to distribute
 *   - actions: Object containing handler functions for quest operations
 *
 * @example
 * const { quests, pointsRemaining, actions } = useQuestSetup();
 *
 * // Add a new quest
 * actions.addQuest(newQuest);
 *
 * // Reorder a quest
 * actions.questOrderChange(quest, 'up');
 *
 * // Adjust experience points
 * actions.experiencePointValueChange(quest, 'up');
 */
export default function useQuestSetup(): UseQuestSetupReturn {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [nextQuestOrderNumber, setNextQuestOrderNumber] = useState<number>(0);
  const [pointsRemaining, setPointsRemaining] = useState<number>(100);

  const handleAddQuest = (quest: Quest) => {
    setQuests((prev) => [...prev, quest]);
    setNextQuestOrderNumber((prev) => prev + 1);
  };
  const handleDeleteQuest = (quest: Quest) => {
    setQuests((prev) => {
      const updatedQuests = prev.filter((q) => quest.name !== q.name);
      const deletedQuestOrder = quest.order;
      for (let i = deletedQuestOrder; i < updatedQuests.length; i++) {
        updatedQuests[i].order -= 1;
      }
      return updatedQuests;
    });
    setNextQuestOrderNumber((prev) => prev - 1);
  };

  const handleQuestOrderChange = (quest: Quest, direction: "up" | "down") => {
    const index = quest.order;
    if (direction === "up") {
      if (index === 0) return; // Already at the top
      setQuests((prev) => {
        // Swap with the quest above
        [prev[index - 1], prev[index]] = [prev[index], prev[index - 1]];
        // Update order numbers
        prev[index - 1].order = index - 1;
        prev[index].order = index;
        return prev;
      });
    } else {
      if (index === quests.length - 1) return; // Already at the bottom
      setQuests((prev) => {
        // Swap with the quest below
        [prev[index + 1], prev[index]] = [prev[index], prev[index + 1]];
        // Update order numbers
        prev[index + 1].order = index + 1;
        prev[index].order = index;
        return prev;
      });
    }
  };

  // TODO: Refactor to useReducer for better state management?
  const handleExperiencePointValueChange = (
    quest: Quest,
    direction: "up" | "down"
  ) => {
    if (direction === "up" && pointsRemaining <= 0) return;
    if (direction === "down" && quest.experiencePointValue <= 0) return;
    setQuests((prev) => {
      const updatedQuests = structuredClone(prev);
      const questToUpdate = updatedQuests[quest.order];
      questToUpdate.experiencePointValue += direction === "up" ? 1 : -1;
      return updatedQuests;
    });
    setPointsRemaining((prev) => prev + (direction === "up" ? -1 : 1));
  };

  return {
    quests,
    nextQuestOrderNumber,
    pointsRemaining,
    actions: {
      addQuest: handleAddQuest,
      deleteQuest: handleDeleteQuest,
      questOrderChange: handleQuestOrderChange,
      experiencePointValueChange: handleExperiencePointValueChange,
    },
  };
}
