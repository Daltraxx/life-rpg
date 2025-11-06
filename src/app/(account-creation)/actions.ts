'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/utils/supabase/server";

// Further validation can be added here as needed
const SignupSchema = z.object({
  email: z.email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
});