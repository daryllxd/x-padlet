'use server';

import { CreateTodoListButton } from '@/components/todos/create-todo-list-button';
import { TodoListGrid } from '@/components/todos/todo-list-grid';
import { fetchTodoLists } from '@/lib/api/todoLists';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { headers } from 'next/headers';

export default async function Home() {
  const queryClient = new QueryClient();

  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}/api/todo-lists`;

  await queryClient.prefetchQuery({
    queryKey: ['todoLists', { status: 'active' }],
    queryFn: () => fetchTodoLists({ status: 'active', baseUrl }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">My Work</h1>
              <p className="text-slate-500">Manage and organize your tasks efficiently</p>
            </div>
            <CreateTodoListButton />
          </div>

          <TodoListGrid />
        </div>
      </div>
    </HydrationBoundary>
  );
}
