import { supabase } from '@/lib/db';
import { revalidateTag } from 'next/cache';

export async function revalidateTodoList(todoListId: string) {
  try {
    revalidateTag(`todos-${todoListId}`);

    // Check for custom URL and revalidate that as well
    const { data: todoList } = await supabase
      .from('todo_lists')
      .select('custom_url')
      .eq('id', todoListId)
      .single();

    if (todoList?.custom_url) {
      revalidateTag(`todos-${todoList.custom_url}`);
    }
  } catch (error: unknown) {
    console.error('❗ Error during todo list revalidation:', error);
  }
}
