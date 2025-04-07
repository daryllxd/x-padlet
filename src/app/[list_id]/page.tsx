'use client';

import { DraggableTodoList } from '@/components/todos/DraggableTodoList';
import { TodoCreateDialog } from '@/components/todos/TodoCreateDialog';
import { useTodoList } from '@/hooks/useTodoLists';
import { useTodos } from '@/hooks/useTodos';
import { TodoItem } from '@/types';
import { use, useRef, useState } from 'react';

export default function Home({ params }: { params: Promise<{ list_id: string }> }) {
  const { list_id: listId } = use(params);

  const { data: todoList, isLoading: isTodoListLoading } = useTodoList(listId);

  const { data: todos, isLoading } = useTodos(listId);

  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const editDialogRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex h-40 items-center justify-center text-slate-500">Loading...</div>
      </div>
    );
  }

  const handleEdit = (id: string) => {
    if (!todos) return;
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      setEditingTodo(todo);
      // Programmatically open the dialog by clicking its internal button
      setTimeout(() => {
        const button = editDialogRef.current?.querySelector('button');
        if (button) button.click();
      }, 0);
    }
  };

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

      <div ref={editDialogRef} className="hidden">
        {editingTodo && (
          <TodoCreateDialog listId={listId} initialTodo={editingTodo} isEditing={true} />
        )}
      </div>

      {todos && todos.length > 0 ? (
        <DraggableTodoList listId={listId} todos={todos} onEdit={handleEdit} />
      ) : (
        <div className="flex h-40 items-center justify-center text-slate-500">
          No todos yet. Add your first todo to get started.
        </div>
      )}
    </div>
  );
}
