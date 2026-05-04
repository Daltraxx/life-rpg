import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function getQuests() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const userId = user.id;

  const { data: quests, error } = await supabase
    .from("quests")
    .select(
      `
    id,
    name,
    description,
    frequency,
    rest_frequency,
    streak,
    strength_points,
    strength_level,
    last_completed_date,
    position,
    updated_at,

    quests_attributes (
      attribute_power,
      attributes (
        id,
        name,
        level,
        experience
      )
    )
  `,
    )
    .eq("user_id", userId)
    .order("position", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return quests;
}
