import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function getUserProgress(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .select(
      `
    id,
    experience,
    purpose,
    attributes (
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
    throw new Error("Error fetching user progress");
  }

  console.log("User progress data:", data);
  return data;
}
