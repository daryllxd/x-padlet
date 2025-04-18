'use server';

import { TodoListPage } from '@/components/todo-lists/todo-list-page';
import { fetchTodoList } from '@/lib/api/todoLists';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { headers } from 'next/headers';

export default async function Page({ params }: { params: Promise<{ todo_list_id: string }> }) {
  const queryClient = new QueryClient();
  const { todo_list_id: todoListId } = await params;
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}/api/todo-lists`;

  await queryClient.prefetchQuery({
    queryKey: ['todoList', todoListId],
    queryFn: () => fetchTodoList({ id: todoListId, baseUrl }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <TodoListPage todoListId={todoListId} />
    </HydrationBoundary>
  );
}
