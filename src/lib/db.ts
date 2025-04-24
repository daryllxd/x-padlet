import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (() => {
  if (!supabaseUrl || !supabaseKey) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      '❗️ Missing Supabase environment variables. Supabase features will not be available.'
    );
    if (!supabaseUrl) console.error('\x1b[31m%s\x1b[0m', '❗ Missing NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseKey)
      console.error('\x1b[31m%s\x1b[0m', '❗ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return {} as ReturnType<typeof createClient>;
  }
  return createClient(supabaseUrl, supabaseKey);
})();

export { supabase };
