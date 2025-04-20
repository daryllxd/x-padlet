'use server';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { TodoListGrid } from '@/components/todos/todo-list-grid';
import { fetchTodoLists } from '@/lib/api/todoLists';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { headers } from 'next/headers';

export default async function Dashboard() {
  const queryClient = new QueryClient();
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}/api/todo-lists`;

  /**
   * @description We want to use a NextJS fetch here to warm the cache
   * @description But, we also want to use the query client to prefetch the data so that the data exists in react-query too.
   */
  const dashboardFetch = fetchTodoLists({ status: 'active', baseUrl });
  await dashboardFetch;

  await queryClient.prefetchQuery({
    queryKey: ['todoLists', { status: 'active' }],
    queryFn: () => dashboardFetch,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <DashboardHeader description="One of the todo list trackers of all time ✨" />
      <HydrationBoundary state={dehydratedState}>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <TodoListGrid />
        </div>
      </HydrationBoundary>
    </>
  );
}
