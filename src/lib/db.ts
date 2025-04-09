import { createClient } from '@supabase/supabase-js';

console.log('process.env', process.env);

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to run queries
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
    console.log('Executed query', { text, duration, rows: data?.length });
    return { rows: data };
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}
