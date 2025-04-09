'use client';

import { useTodoLists } from '@/hooks/useTodoLists';
import { TodoList } from '@/types/todo';
import { TodoListSkeleton } from '../todo-lists/todo-list-skeleton';
import { TodoListCard } from './todo-list-card';

export function TodoListGrid() {
  const { data, isLoading, error } = useTodoLists();

  if (isLoading) {
    return <TodoListSkeleton />;
  }

  if (error) {
    return (
      <div className="mt-12 rounded-xl border-2 border-dashed border-red-200 bg-red-50 p-12 text-center">
        <h3 className="text-xl font-medium text-red-900">Error loading todo lists</h3>
        <p className="mt-2 text-red-500">Please try again later</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mt-12 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
        <h3 className="text-xl font-medium text-slate-900">No todo lists yet</h3>
        <p className="mt-2 text-slate-500">Create your first todo list to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((list: TodoList) => (
        <TodoListCard
          key={list.id}
          id={list.id}
          title={list.title}
          description={list.description}
          todoCount={list.todoCount}
        />
      ))}
    </div>
  );
}
