'use server';

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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Puglet
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                One of the todo lists of all time
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <TodoListGrid />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
