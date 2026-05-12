/**
 * Calculates the total experience earned based on an experience share and a multiplier.
 * @param experienceShare - The base experience amount to be shared
 * @param multiplier - The multiplier to apply to the experience share
 * @returns The total experience earned, rounded down to the nearest integer
 */
export default function getExperienceEarned(
  experienceShare: number,
  multiplier: number,
): number {
  return Math.floor(experienceShare + experienceShare * multiplier);
}
