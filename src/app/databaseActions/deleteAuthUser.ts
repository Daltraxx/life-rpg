"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function deleteAuthUser() {
  const supabase = await createSupabaseServerClient();
}