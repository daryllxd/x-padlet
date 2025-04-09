'use client';

import { DraggableTodoList } from '@/components/todos/draggable-todo-list';
import { TodoCreateDialog } from '@/components/todos/todo-create-dialog';
import { useTodoList } from '@/hooks/useTodoLists';
import { useTodos } from '@/hooks/useTodos';
import { use } from 'react';

export default function Home({ params }: { params: Promise<{ list_id: string }> }) {
  const { list_id: listId } = use(params);

  const { data: todoList, isLoading: isTodoListLoading } = useTodoList(listId);

  const { todos, isLoading } = useTodos(listId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex h-40 items-center justify-center text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{todoList?.title}</h1>
          <div className="flex gap-4">
            <TodoCreateDialog listId={listId} />
          </div>
        </div>
      </header>

      {todos && todos.length > 0 ? (
        <DraggableTodoList listId={listId} todos={todos} />
      ) : (
        <div className="flex h-40 items-center justify-center text-slate-500">
          No todos yet. Add your first todo to get started.
        </div>
      )}
    </div>
  );
}
