import {
  BASE_EXPERIENCE_FOR_ATTRIBUTE_LEVEL_2,
  ATTRIBUTE_LEVEL_EXPERIENCE_INCREASE_FACTOR,
} from "../constants/gameConstants";

/**
 * Represents the current level progress of an attribute.
 * @property {number} level - The current level of the attribute.
 * @property {number} levelExperienceStart - The experience points required to reach the current level.
 * @property {number} levelExperienceEnd - The experience points required to reach the next level.
 */
export interface AttributeLevelProgress {
  level: number;
  levelExperienceStart: number;
  levelExperienceEnd: number;
}

/**
 * Calculates the current attribute level and experience progress based on total experience.
 *
 * @param experience - The total experience points accumulated for the attribute
 * @returns An {@link AttributeLevelProgress} object containing the current level and experience thresholds
 *
 * @example
 * ```typescript
 * const progress = getAttributeLevelProgress(1500);
 * console.log(progress.level); // Current level
 * console.log(progress.levelExperienceStart); // XP needed to reach current level
 * console.log(progress.levelExperienceEnd); // XP needed to reach next level
 * ```
 * @remarks This function uses an iterative approach to calculate the level,
 * which is efficient for typical experience values in a life RPG context.
 * If performance becomes a concern with very high experience values,
 * we can optimize using a closed-form solution, caching, or binary search with generated thresholds.
 */
export default function getAttributeLevelProgress(
  experience: number,
): AttributeLevelProgress {
  if (!Number.isFinite(experience) || experience < 0) {
    throw new Error("experience must be a non-negative finite number");
  }

  let level = 1;
  let levelStart = 0;
  let xpToNext = BASE_EXPERIENCE_FOR_ATTRIBUTE_LEVEL_2;
  while (experience >= levelStart + xpToNext) {
    levelStart += xpToNext;
    level++;
    xpToNext = Math.floor(
      xpToNext * ATTRIBUTE_LEVEL_EXPERIENCE_INCREASE_FACTOR,
    );
  }

  return {
    level,
    levelExperienceStart: levelStart,
    levelExperienceEnd: levelStart + xpToNext,
  };
}
