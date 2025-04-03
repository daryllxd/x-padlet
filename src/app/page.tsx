'use client';

import { TodoListCard } from '@/components/todos/TodoListCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useTodoLists } from '@/hooks/useTodoLists';
import { TodoList } from '@/types/todo';

export default function Home() {
  const { data: todoLists, isLoading, error } = useTodoLists();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-red-500">Error loading todo lists</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Todo Lists</h1>
        {/* We'll add a create button later */}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {todoLists?.map((list: TodoList) => (
          <TodoListCard
            key={list.id}
            id={list.id}
            title={list.title}
            description={list.description}
            todoCount={list.todoCount}
          />
        ))}
      </div>
    </div>
  );
}
