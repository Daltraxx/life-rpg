import { BASE_EXPERIENCE_FOR_LEVEL_2, EXPERIENCE_INCREASE_FACTOR } from "../constants/gameConstants";

/**
 * Represents the current level progress of a user.
 * @property {number} level - The current level of the user.
 * @property {number} levelExperienceStart - The experience points required to reach the current level.
 * @property {number} levelExperienceEnd - The experience points required to reach the next level.
 */
export interface UserLevelProgress {
  level: number;
  levelExperienceStart: number;
  levelExperienceEnd: number;
}

/**
 * Calculates the user's current level and experience progress.
 *
 * Each level requires 20% more experience than the previous level.
 * Level 1 starts at 0 XP, and level 2 requires 300 XP.
 *
 * @param experience - The total experience points of the user.
 * @returns The user's current level and experience thresholds.
 */
export default function getUserLevelProgress(
  experience: number,
): UserLevelProgress {
  if (experience < BASE_EXPERIENCE_FOR_LEVEL_2) {
    return {
      level: 1,
      levelExperienceStart: 0,
      levelExperienceEnd: BASE_EXPERIENCE_FOR_LEVEL_2,
    };
  }

  let level = 1;
  let xpForNextLevel = BASE_EXPERIENCE_FOR_LEVEL_2; // Each level requires 20% more XP than the previous
  while (experience >= xpForNextLevel) {
    level++;
    xpForNextLevel +=
      BASE_EXPERIENCE_FOR_LEVEL_2 * Math.pow(EXPERIENCE_INCREASE_FACTOR, level - 1); // Increase XP requirement for next level
  }
  
  return {
    level,
    levelExperienceStart:
      xpForNextLevel -
      BASE_EXPERIENCE_FOR_LEVEL_2 * Math.pow(EXPERIENCE_INCREASE_FACTOR, level - 1),
    levelExperienceEnd: xpForNextLevel,
  };
}
