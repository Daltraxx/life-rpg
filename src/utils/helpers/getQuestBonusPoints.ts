/**
 * Calculates the bonus points for a quest based on experience share and multiplier.
 * Differs from getExperienceEarned in that it does not add the base experience share to the final total,
 * since these bonus points are meant to be added on top of the base experience share.
 * @param experienceShare - The base experience share amount
 * @param multiplier - The multiplier to apply to the experience share
 * @returns The calculated quest bonus points as an integer
 * @throws Will throw an error if experienceShare or multiplier are not non-negative finite numbers
 * @example
 * ```typescript
 * const bonus = getQuestBonusPoints(50, 1.5);
 * console.log(bonus); // 75
 * ```
 */
export default function getQuestBonusPoints(
  experienceShare: number,
  multiplier: number,
): number {
  if (!Number.isFinite(experienceShare) || experienceShare < 0) {
    throw new Error("experienceShare must be a non-negative finite number");
  } else if (!Number.isFinite(multiplier) || multiplier < 0) {
    throw new Error("multiplier must be a non-negative finite number");
  }

  return Math.floor(experienceShare * multiplier);
}
