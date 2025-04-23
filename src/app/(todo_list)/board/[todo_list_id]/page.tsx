'use server';

import { TodoListPage } from '@/components/todo-lists/todo-list-page';
import { fetchTodoList } from '@/lib/api/todoLists';
import { TodoList } from '@/types/todo-list';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { headers } from 'next/headers';

export default async function Page({ params }: { params: Promise<{ todo_list_id: string }> }) {
  const queryClient = new QueryClient();
  const { todo_list_id: todoListId } = await params;
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}/api/todo-lists/${todoListId}`;

  await queryClient.prefetchQuery({
    queryKey: ['todoList', todoListId],
    queryFn: () => fetchTodoList({ id: todoListId, baseUrl }),
  });

  await queryClient.prefetchQuery<TodoList>({
    queryKey: ['todos', todoListId],
    queryFn: async () => {
      const response = await fetch(`https://${host}/api/todos?todo_list_id=${todoListId}`, {
        cache: 'force-cache',
        next: {
          revalidate: 60000,
        },
      });
      const data = await response.json();
      return data;
    },
  });

  const prefetchedTodoList = queryClient.getQueryData<TodoList>(['todoList', todoListId]);
  const prefetchedTodos = queryClient.getQueryData<TodoList>(['todos', todoListId]);
  const derivedId = prefetchedTodoList?.id;

  if (derivedId && derivedId !== todoListId) {
    queryClient.setQueryData(['todos', derivedId], prefetchedTodos);
    queryClient.setQueryData(['todoList', derivedId], prefetchedTodoList);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <TodoListPage todoListId={todoListId} />
    </HydrationBoundary>
  );
}
