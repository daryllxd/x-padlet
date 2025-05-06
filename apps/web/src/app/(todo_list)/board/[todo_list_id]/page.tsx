'use server';

import { TodoListPage } from '@/components/todo-lists/todo-list-page';
import { fetchTodoList } from '@/lib/api/todoLists';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { TodoList } from '@x-padlet/types';
import { headers } from 'next/headers';

export async function generateStaticParams() {
  return [{ todo_list_id: 'puglet-adventures' }, { todo_list_id: 'hello-world' }];
}

export default async function Page({ params }: { params: Promise<{ todo_list_id: string }> }) {
  const queryClient = new QueryClient();
  const { todo_list_id: todoListId } = await params;
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}/api/todo-lists/${todoListId}`;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['todoList', todoListId],
      queryFn: () => fetchTodoList({ id: todoListId, baseUrl }),
    }),

    queryClient.prefetchQuery<TodoList>({
      queryKey: ['todos', todoListId],
      queryFn: async () => {
        const response = await fetch(`https://${host}/api/todos?todo_list_id=${todoListId}`, {
          cache: 'force-cache',
          next: {
            revalidate: 60000,
            tags: [`todos-${todoListId}`],
          },
        });
        const data = await response.json();
        return data;
      },
    }),
  ]);

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
