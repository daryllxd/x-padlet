'use client';

import { DraggableTodoList } from '@/components/todos/draggable-todo-list';
import { TodoCreateDialog } from '@/components/todos/todo-create-dialog';
import { useTodoList } from '@/hooks/useTodoLists';
import { useTodos } from '@/hooks/useTodos';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { use, useEffect } from 'react';
import { toast } from 'sonner';

export default function TodoListPage({ params }: { params: Promise<{ todo_list_id: string }> }) {
  const { todo_list_id: todoListId } = use(params);

  const { data: todoList } = useTodoList(todoListId);

  const { todos, isLoading } = useTodos(todoListId);

  useEffect(() => {
    if (todoList?.status === 'archived') {
      toast.error('This todo list is archived');
      redirect('/');
    }
  }, [todoList?.status]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="flex h-40 items-center justify-center text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl">{todoList?.title}</h1>
              {todos && todos.length > 0 && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm text-slate-600">
                  {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
                </span>
              )}
            </div>
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
        <div className="m-10 flex flex-col items-center justify-center text-slate-500 sm:m-20">
          <Image
            src="/meditating-doodle.svg"
            alt="Meditating Doodle"
            className="h-32 w-32 sm:h-40 sm:w-40"
            width={160}
            height={160}
          />
          <p className="mt-4 text-center">Nothing yet here! Let's get started.</p>
        </div>
      )}
    </div>
  );
}
