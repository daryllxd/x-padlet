import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_NO_ITEMS_FOUND } from './supabase-errors';

type LookupOptions = {
  id: string;
  select: string;
  supabase: SupabaseClient;
};

export async function lookupTodoList({
  id,
  select,
  supabase,
}: LookupOptions): Promise<{ data: any } | { error: Error | null; status: number }> {
  // Try custom_url first
  let { data, error } = await supabase
    .from('todo_lists')
    .select(select)
    .eq('custom_url', id)
    .single();

  if (error && error.code === SUPABASE_NO_ITEMS_FOUND) {
    // Fall back to id lookup
    const { data: idData, error: idError } = await supabase
      .from('todo_lists')
      .select(select)
      .eq('id', id)
      .single();

    if (idError) {
      console.error('Supabase fetch error:', idError);
      return { error: new Error('Failed to fetch todo list'), status: 400 };
    }

    data = idData;
  } else if (error) {
    console.error('Supabase fetch error:', error);
    return { error: new Error('Failed to fetch todo list'), status: 500 };
  }

  return { data };
}
