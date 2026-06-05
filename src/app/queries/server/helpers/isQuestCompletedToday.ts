import getBeginningAndEndOfDayUTC from "@/utils/helpers/getBeginningAndEndOfDayUTC";
import getUserTimezone from "../getUserTimezone";

type QuestCompletionRecordItems = {
  completed_at: string;
  processed_at: string | null;
} | null;

type isCompletedTodayParams = {
  userId: string;
  latestCompletion: QuestCompletionRecordItems;
};

/**
 * Determines if a quest completion occurred today in the user's timezone.
 *
 * @param {isCompletedTodayParams} params - The parameters for checking if a quest was completed today.
 * @param {string} params.userId - The unique identifier of the user.
 * @param {QuestCompletionRecordItems} params.latestCompletion - The latest completion record for a quest, or null if no completion exists.
 * @returns {Promise<boolean>} True if the quest was completed today and not processed, false otherwise.
 *
 * @remarks
 * - Returns false if latestCompletion is null or if the completion has been processed.
 * - Completion date is compared against the user's timezone-adjusted day boundaries.
 */
export default async function isQuestCompletedToday({
  userId,
  latestCompletion,
}: isCompletedTodayParams): Promise<boolean> {
  if (!latestCompletion || latestCompletion.processed_at) {
    return false;
  }
  try {
    const userTimezone = await getUserTimezone(userId);
    const { beginningOfDayUTC, endOfDayUTC } =
      getBeginningAndEndOfDayUTC(userTimezone);
    return (
      latestCompletion.completed_at >= beginningOfDayUTC &&
      latestCompletion.completed_at < endOfDayUTC
    );
  } catch (error) {
    console.error("Error checking quest completion status:", error);
    throw new Error("Failed to check if quest was completed today", {
      cause: error,
    });
  }
}
