import { TodoListSkeleton } from '@/components/todo-lists/todo-list-skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-10 w-48 animate-pulse rounded bg-slate-200"></div>
            <div className="h-5 w-64 animate-pulse rounded bg-slate-200"></div>
          </div>
          <div className="h-10 w-32 animate-pulse rounded bg-slate-200"></div>
        </div>

        <TodoListSkeleton />
      </div>
    </div>
  );
}
