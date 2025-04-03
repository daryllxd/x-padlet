"use client";

import { useState, useRef } from "react";
import { AddTodoDialog } from "@/components/todos/AddTodoDialog";
import { DraggableTodoList } from "@/components/todos/DraggableTodoList";
import { useTodo } from "@/context/TodoContext";
import { TodoItem } from "@/types";

export default function Home() {
  const { todos } = useTodo();
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const editDialogRef = useRef<HTMLDivElement>(null);

  const handleEdit = (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      setEditingTodo(todo);
      // Programmatically open the dialog by clicking its internal button
      setTimeout(() => {
        const button = editDialogRef.current?.querySelector("button");
        if (button) button.click();
      }, 0);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Todo List</h1>
          <div className="flex gap-4">
            <AddTodoDialog />
          </div>
        </div>
      </header>

      {/* Hidden edit dialog that will be triggered programmatically */}
      <div ref={editDialogRef} className="hidden">
        {editingTodo && (
          <AddTodoDialog initialTodo={editingTodo} isEditing={true} />
        )}
      </div>

      {todos.length > 0 ? (
        <DraggableTodoList todos={todos} onEdit={handleEdit} />
      ) : (
        <div className="flex items-center justify-center h-40 text-slate-500">
          No todos yet. Add your first todo to get started.
        </div>
      )}
    </div>
  );
}
