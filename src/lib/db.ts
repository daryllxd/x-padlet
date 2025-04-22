import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient>;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.error(
    '\x1b[31m%s\x1b[0m',
    '❗️ Missing Supabase environment variables. Supabase features will not be available.'
  );
  if (!supabaseUrl) console.error('\x1b[31m%s\x1b[0m', '❗ Missing NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseKey) console.error('\x1b[31m%s\x1b[0m', '❗ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export { supabase };

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    // For raw SQL queries, we need to use the REST API
    // This is a simplified version - in production, you might want to use a more secure approach
    const { data, error } = await supabase.rpc('execute_sql', {
      query_text: text,
      query_params: params,
    });

    if (error) throw error;

    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: Array.isArray(data) ? data.length : 0 });
    return { rows: data };
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}
