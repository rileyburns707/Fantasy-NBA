import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and Anon key from the environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if the variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or Anon key are not defined in the environment variables.');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);