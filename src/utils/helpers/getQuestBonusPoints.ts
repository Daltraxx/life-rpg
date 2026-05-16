/**
 * Calculates the bonus points for a quest based on experience share and multiplier.
 * Differs from getExperienceEarned in that it does not add the base experience share to the final total,
 * since these bonus points are meant to be added on top of the base experience share.
 * @param experienceShare - The base experience share amount
 * @param multiplier - The multiplier to apply to the experience share
 * @returns The calculated quest bonus points
 */
export default function getQuestBonusPoints(
  experienceShare: number,
  multiplier: number,
): number {
  return experienceShare * multiplier;
}
