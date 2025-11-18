import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

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
    console.error("Error checking existing user:", error);
    throw new Error("Error checking existing user");
  } 
};
