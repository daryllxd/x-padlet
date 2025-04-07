'use client';

import { TodoListCard } from '@/components/todos/todo-list-card';
import { TodoListCreateDialog } from '@/components/todos/todo-list-create-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTodoLists } from '@/hooks/useTodoLists';
import { TodoList } from '@/types/todo';
import { useState } from 'react';

export default function Home() {
  const { data: todoLists, isLoading, error } = useTodoLists();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 flex items-center justify-between">
          <Skeleton className="h-12 w-56" />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-red-600">Error loading todo lists</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700 transition-colors hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">My Work</h1>
            <p className="text-slate-500">Manage and organize your tasks efficiently</p>
          </div>
          <Button
            size="lg"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
          >
            Create New List
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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

        {todoLists?.length === 0 && (
          <div className="mt-12 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
            <h3 className="text-xl font-medium text-slate-900">No todo lists yet</h3>
            <p className="mt-2 text-slate-500">Create your first todo list to get started</p>
          </div>
        )}

        <TodoListCreateDialog
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </div>
  );
}
