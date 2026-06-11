import {
  ATTRIBUTE_LEVEL_BASE_XP,
  ATTRIBUTE_LEVEL_EXPONENT_STEEPNESS,
  USER_LEVEL_BASE_XP,
  USER_LEVEL_EXPONENT_STEEPNESS,
} from "@/utils/constants/gameConstants";

const STARTING_LEVEL = 1;

/**
 * Represents the type of entity for which experience is being calculated.
 * @typedef {("user" | "attribute")} LevelType
 */
type LevelType = "user" | "attribute";

/**
 * Calculates the experience required to reach a specific level.
 * @param {number} level - The level for which to calculate required experience.
 * @param {LevelType} levelType - The type of entity ("user" or "attribute").
 * @returns {number} The experience points required to reach the specified level.
 */
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

/**
 * Calculates the current level based on experience points.
 * Uses the inverse of the experience calculation 
 * to determine the level corresponding to the given experience.
 * @param {number} experience - The total experience points.
 * @param {LevelType} levelType - The type of entity ("user" or "attribute").
 * @returns {number} The current level of the entity.
 */
export const calculateLevel = (
  experience: number,
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
  if (experience < baseXP) return STARTING_LEVEL;
  const rawLevel = Math.pow(experience / baseXP, 1 / exponentSteepness) + STARTING_LEVEL;
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
