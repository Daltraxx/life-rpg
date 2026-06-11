import {
  ATTRIBUTE_LEVEL_BASE_XP,
  ATTRIBUTE_LEVEL_EXPONENT_STEEPNESS,
  USER_LEVEL_BASE_XP,
  USER_LEVEL_EXPONENT_STEEPNESS,
} from "@/utils/constants/gameConstants";

const STARTING_LEVEL = 1;

type LevelType = "user" | "attribute";

export const caluculateExperienceForLevel = (
  level: number,
  levelType: LevelType,
): number => {
  const { baseXP, exponentSteepness } =
    levelType === "user"
      ? {
          baseXP: USER_LEVEL_BASE_XP,
          exponentSteepness: USER_LEVEL_EXPONENT_STEEPNESS,
        }
      : {
          baseXP: ATTRIBUTE_LEVEL_BASE_XP,
          exponentSteepness: ATTRIBUTE_LEVEL_EXPONENT_STEEPNESS,
        };

  if (level <= STARTING_LEVEL) return 0;
  // Floor in case of fractional XP due to non-integer steepness, ensuring XP requirements are whole numbers.
  return Math.floor(
    baseXP * Math.pow(level - STARTING_LEVEL, exponentSteepness),
  );
};

export const calculateLevel = (
  experience: number,
  levelType: LevelType,
): number => {
  const { baseXP } =
    levelType === "user"
      ? {
          baseXP: USER_LEVEL_BASE_XP,
        }
      : {
          baseXP: ATTRIBUTE_LEVEL_BASE_XP,
        };
  if (experience < baseXP) return STARTING_LEVEL;
  const rawLevel = Math.cbrt(experience / baseXP) + STARTING_LEVEL; // Cube root for exponent 3, adjust for starting level
  return Math.floor(rawLevel);
};

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
 * @param {LevelType} levelType - The type of level to calculate (user or attribute)
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
  levelType: LevelType,
): LevelProgress => {
  if (!Number.isFinite(currentExperience) || currentExperience < 0) {
    throw new Error("currentExperience must be a non-negative finite number");
  }

  const level = calculateLevel(currentExperience, levelType);
  const levelStart = caluculateExperienceForLevel(level, levelType);
  const levelEnd = caluculateExperienceForLevel(level + 1, levelType);

  return {
    level,
    levelStart,
    levelEnd,
  };
};
