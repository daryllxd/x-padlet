'use client';

import { DraggableTodoList } from '@/components/todos/draggable-todo-list';
import { TodoCreateDialog } from '@/components/todos/todo-create-dialog';
import { useTodoList } from '@/hooks/useTodoLists';
import { useTodos } from '@/hooks/useTodos';
import Image from 'next/image';
import { use } from 'react';

export default function TodoListPage({ params }: { params: Promise<{ todo_list_id: string }> }) {
  const { todo_list_id: todoListId } = use(params);

  const { data: todoList } = useTodoList(todoListId);

  const { todos, isLoading } = useTodos(todoListId);

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
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">{todoList?.title}</h1>
            <p className="text-sm text-slate-500">{todoList?.description}</p>
          </div>
          <div className="flex gap-4">
            <TodoCreateDialog listId={todoListId} />
          </div>
        </div>
      </header>

      {todos && todos.length > 0 ? (
        <DraggableTodoList listId={todoListId} todos={todos} />
      ) : (
        <div className="m-20 flex flex-col items-center justify-center text-slate-500">
          <Image
            src="/meditating-doodle.svg"
            alt="Meditating Doodle"
            className="h-40 w-40"
            width={160}
            height={160}
          />
          <p>Nothing yet here! Let's get started.</p>
        </div>
      )}
    </div>
  );
}
