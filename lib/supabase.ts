import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create and export the Supabase client
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Export function to create client for client components
export function createClient() {
  return createSupabaseClient(supabaseUrl!, supabaseAnonKey!);
}
