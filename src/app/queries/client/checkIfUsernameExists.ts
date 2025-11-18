import { createSupabaseBrowserClient } from "@/utils/supabase/client";

const supabase = createSupabaseBrowserClient();

export default async function checkIfUsernameExists(username: string): Promise<boolean> {
  let result;
  try {
    result = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single();
    return result.data !== null;
  } catch (error) {
    throw new Error("Error checking existing user");
  } 
};
