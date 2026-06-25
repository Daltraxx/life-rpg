import { createSupabaseServerClient } from "@/utils/supabase/server";
import { UserProgress } from "@/utils/types/UserProgress";
import {
  calculateLevelProgress,
  type LevelProgress,
} from "@/utils/helpers/calculateLevelProgress";
import type { QueryResponse } from "@/utils/types/query-response";

/**
 * Fetches and calculates the progress data for a user.
 *
 * @param userId - The unique identifier of the user.
 * @returns A promise that resolves to the user's progress data, including level, experience, purpose, and attribute progress.
 * @throws Error if the user data cannot be fetched from the database.
 */
export default async function getUserProgress(
  userId: string,
): Promise<QueryResponse<UserProgress>> {
  const supabase = await createSupabaseServerClient();

  // RLS policies further restrict access to only user data belonging to the authenticated user,
  // so combined with this function only being called on the server,
  // we can be confident that users cannot access data that doesn't belong to them.
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      username,
      experience,
      purpose,
      attributes (
        id,
        name,
        experience,
        position
      )
      `,
    )
    .eq("id", userId)
    .order("position", {
      ascending: true,
      referencedTable: "attributes",
    })
    .single();

  if (error) {
    console.error("Error fetching user progress:", error);
    return {
      data: null,
      error: error,
    };
  }

  const userLevelProgress: LevelProgress = calculateLevelProgress(
    data.experience,
    "user",
  );

  const userProgress: UserProgress = {
    level: userLevelProgress.level,
    userId: data.id,
    username: data.username,
    experience: data.experience,
    purpose: data.purpose,
    levelStart: userLevelProgress.levelStart,
    levelEnd: userLevelProgress.levelEnd,
    attributes: data.attributes.map((attr) => {
      const attributeLevelProgress: LevelProgress = calculateLevelProgress(
        attr.experience,
        "attribute",
      );
      return {
        id: attr.id,
        name: attr.name,
        experience: attr.experience,
        position: attr.position,
        level: attributeLevelProgress.level,
        levelStart: attributeLevelProgress.levelStart,
        levelEnd: attributeLevelProgress.levelEnd,
      };
    }),
  };

  return {
    data: userProgress,
    error: null,
  };
}
