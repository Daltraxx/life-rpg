import {
  BASE_EXPERIENCE_FOR_LEVEL_2,
  EXPERIENCE_INCREASE_FACTOR,
} from "../constants/gameConstants";

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
 * The experience required for each level increases by a factor defined in game constants.
 *
 * @param experience - The total experience points of the user.
 * @returns The user's current level and experience thresholds.
 * @remarks This iterative computation is adequate for typical user experience values,
 * as levels will not exceed reasonable limits in a life RPG context. If performance becomes a concern,
 * we can optimize with a closed-form solution, caching, or binary search.
 */
export default function getUserLevelProgress(
  experience: number,
): UserLevelProgress {

  let level = 1;
  let levelStart = 0;
  let xpToNext = BASE_EXPERIENCE_FOR_LEVEL_2;
  while (experience >= levelStart + xpToNext) {
    levelStart += xpToNext;
    level++;
    xpToNext = Math.floor(xpToNext * EXPERIENCE_INCREASE_FACTOR);
  }

  return {
    level,
    levelExperienceStart: levelStart,
    levelExperienceEnd: levelStart + xpToNext,
  };
}
