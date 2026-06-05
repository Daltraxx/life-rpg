import {
  ATTRIBUTE_LEVEL_EXPERIENCE_INCREASE_FACTOR,
  BASE_EXPERIENCE_FOR_ATTRIBUTE_LEVEL_2,
  BASE_EXPERIENCE_FOR_USER_LEVEL_2,
  USER_LEVEL_EXPERIENCE_INCREASE_FACTOR,
} from "@/utils/constants/gameConstants";

/**
 * Represents the progress of an entity toward the next level.
 * @interface LevelProgress
 * @property {number} level - The current level of the entity.
 * @property {number} levelStart - The experience points required to reach the current level.
 * @property {number} levelEnd - The experience points required to reach the next level.
 */
export interface LevelProgress {
  level: number;
  levelStart: number;
  levelEnd: number;
}

/**
 * Calculates level progression based on accumulated experience.
 * @param {number} currentExperience - The current amount of experience accumulated
 * @param {("user" | "attribute")} levelType - The type of level to calculate (user or attribute)
 * @returns {LevelProgress} The current level and experience thresholds
 * @example
 * const progress = calculateLevelProgress(5000, "user");
 * console.log(progress.level); // e.g., 3
 * @remarks This iterative computation is adequate for typical user experience values,
 * as levels will not exceed reasonable limits in a life RPG context. If performance becomes a concern,
 * we can optimize with a closed-form solution, caching, or binary search.
 */
export const calculateLevelProgress = (
  currentExperience: number,
  levelType: "user" | "attribute",
): LevelProgress => {
  if (!Number.isFinite(currentExperience) || currentExperience < 0) {
    throw new Error("currentExperience must be a non-negative finite number");
  }
  
  let baseExperience: number;
  let increaseFactor: number;
  if (levelType === "user") {
    baseExperience = BASE_EXPERIENCE_FOR_USER_LEVEL_2;
    increaseFactor = USER_LEVEL_EXPERIENCE_INCREASE_FACTOR;
  } else {
    baseExperience = BASE_EXPERIENCE_FOR_ATTRIBUTE_LEVEL_2;
    increaseFactor = ATTRIBUTE_LEVEL_EXPERIENCE_INCREASE_FACTOR;
  }

  let level = 1;
  let levelStart = 0;
  let xpToNext = baseExperience;
  while (currentExperience >= levelStart + xpToNext) {
    levelStart += xpToNext;
    level++;
    xpToNext = Math.floor(xpToNext * increaseFactor);
  }
  return {
    level,
    levelStart,
    levelEnd: levelStart + xpToNext,
  };
};
