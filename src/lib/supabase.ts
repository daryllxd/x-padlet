import { createClient } from '@supabase/supabase-js';

// These environment variables will be set in your .env.local file
// and in your Vercel project settings for production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type for contact form submissions
export type ContactFormSubmission = {
  id?: string;
  name: string;
  email: string;
  message: string;
  category?: string;
  created_at?: string;
};
