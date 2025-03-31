
import { createClient } from '@supabase/supabase-js';

// Try to get the Supabase URL and anonymous key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the required environment variables are defined
if (!supabaseUrl) {
  console.error(
    'VITE_SUPABASE_URL environment variable is not defined. ' +
    'Please add it to your .env file or environment variables.'
  );
}

if (!supabaseAnonKey) {
  console.error(
    'VITE_SUPABASE_ANON_KEY environment variable is not defined. ' +
    'Please add it to your .env file or environment variables.'
  );
}

// For development/demo purposes only, you can use a mock client when credentials are missing
// In production, you would want to fail hard if these are missing
const useMockClient = !supabaseUrl || !supabaseAnonKey;

// Create a mock client with limited functionality for development/demo
const createMockClient = () => {
  console.warn('Using mock Supabase client because credentials are missing. Authentication will not work.');
  
  // Return a mock client with the basic shape but non-functional auth methods
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: null, error: new Error('Mock auth client - not connected to Supabase') }),
      signUp: async () => ({ data: null, error: new Error('Mock auth client - not connected to Supabase') }),
      signOut: async () => ({ error: null })
    }
  };
};

// Create and export the Supabase client
export const supabase = useMockClient 
  ? createMockClient() as any
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
