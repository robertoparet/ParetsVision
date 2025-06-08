import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Function to check if URL is valid
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.startsWith('https://') && url.includes('.supabase.co');
  } catch {
    return false;
  }
};

// Only create client if we have valid configuration
export const supabase = (() => {
  if (!supabaseUrl || !supabaseKey || !isValidUrl(supabaseUrl)) {
    console.warn('Supabase configuration not complete. Client will not be initialized.');
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
})();

// Server-side client with service role for admin operations
export const createServerSupabaseClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl || !supabaseServiceKey || !isValidUrl(supabaseUrl)) {
    console.warn('Supabase server configuration not complete. Server client will not be initialized.');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
