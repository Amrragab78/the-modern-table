import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase public environment variables");
}

// Public client for general use with proper cookie handling
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    cookieOptions: {
      domain: undefined, // Auto-detect domain (works for localhost, Vercel, Netlify, etc.)
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  }
);

// Helper function to create client for client components (for auth)
export function createClientHelper() {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookieOptions: {
        domain: undefined, // Auto-detect domain (works for localhost, Vercel, Netlify, etc.)
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
}

// Admin-only client (SERVICE ROLE) – used ONLY in server-side code
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
