import type { User } from "@supabase/supabase-js";

// TODO: figure out effective way to add fake test users in supabase for testing purposes
export const testUser: User = {
  id: "00069d57-58ba-4be2-b207-bd86b65169a1",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2025-12-04 01:16:48.28294+00",
  updated_at: "2025-12-04 01:17:17.201179+00",
  email: "dpettus0713@gmail.com",
};