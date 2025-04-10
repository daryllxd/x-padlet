'use client';

import { DraggableTodoList } from '@/components/todos/draggable-todo-list';
import { TodoCreateDialog } from '@/components/todos/todo-create-dialog';
import { useTodoList } from '@/hooks/useTodoLists';
import { useTodos } from '@/hooks/useTodos';
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
          <h1 className="text-3xl font-bold">{todoList?.title}</h1>
          <div className="flex gap-4">
            <TodoCreateDialog listId={todoListId} />
          </div>
        </div>
      </header>

      {todos && todos.length > 0 ? (
        <DraggableTodoList listId={todoListId} todos={todos} />
      ) : (
        <div className="flex h-40 items-center justify-center text-slate-500">
          No todos yet. Add your first todo to get started.
        </div>
      )}
    </div>
  );
}
