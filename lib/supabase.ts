import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

// Admin client with service role key for full database access (bypasses RLS)
// This should only be used in server-side code or secure admin operations
export const supabaseAdmin = supabaseServiceRoleKey
  ? createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
