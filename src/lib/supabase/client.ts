import { createClient } from "@supabase/supabase-js";

// Note: In a real app, you would set these values in environment variables
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-supabase-url.com";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key";

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Flag to check if we're using mock credentials
export const isUsingMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL;
