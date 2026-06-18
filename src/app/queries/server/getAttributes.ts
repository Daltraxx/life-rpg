import { createSupabaseServerClient } from "@/utils/supabase/server";
import { Attribute } from "@/utils/types/attribute";
import { AttributeArraySchema } from "@/utils/validations/attribute";

/**
 * Fetches all attributes for the currently authenticated user.
 *
 * @returns {Promise<Attribute[]>} A promise that resolves to an array of attributes ordered by position.
 * @throws {Error} Throws an error if the user is not authenticated, the database query fails, or the attribute data is invalid.
 */
export default async function getAttributes(): Promise<Attribute[]> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("attributes")
    .select(
      `
      id,
      name,
      level,
      experience,
      position
      `,
    )
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  if (error) {
    throw new Error("Error fetching attributes", { cause: error });
  }

  const validationResult = AttributeArraySchema.safeParse(data);
  if (!validationResult.success) {
    console.error("Attribute data validation failed:", validationResult.error);
    throw new Error("Invalid attribute data format", { cause: validationResult.error });
  }

  return validationResult.data as Attribute[];
}
