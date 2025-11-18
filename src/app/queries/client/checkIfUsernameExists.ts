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
    if (error instanceof Error && "status" in error && error.status === 406) {
      // Username does not exist
      return false;
    }
    console.error("Error checking existing user:", error);
    throw new Error("Error checking existing user");
  } 
};
