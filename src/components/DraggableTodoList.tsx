"use client";

import { useEffect, useRef, useState } from "react";
import {
  draggable,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { TodoCard } from "./TodoCard";
import { TodoItem } from "@/types";
import { useTodo } from "@/context/TodoContext";
import { socketEvents } from "@/lib/socket";
import { cn } from "@/lib/utils";

interface DraggableTodoListProps {
  todos: TodoItem[];
  onEdit: (id: string) => void;
}

export function DraggableTodoList({ todos, onEdit }: DraggableTodoListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (todoId: string) => {
    setDraggedId(todoId);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setIsDragging(false);
  };

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const dropTarget = location.current.dropTargets[0] as unknown as {
          data: { id: string; title: string };
        };

        if (!dropTarget) {
          return;
        }

        const sourceId = source.data as unknown as {
          id: string;
          title: string;
        };
        const dropTargetId = dropTarget.data.id;

        if (sourceId.id === dropTargetId) {
          return;
        }

        const currentOrder = todos
          .filter((t) => t.id !== sourceId.id)
          .map((t) => t.id);

        const newOrder = currentOrder
          .map((x) => {
            if (x === dropTargetId) {
              return [dropTargetId, sourceId.id];
            }

            return x;
          })
          .flat();

        socketEvents.reorderTodos(newOrder);
      },
    });
  }, [todos]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          data-todo-id={todo.id}
          className={cn(draggedId === todo.id && isDragging && "opacity-50")}
          draggable
          onDrop={(e) => {
            e.preventDefault();
            const dropTarget = (e.currentTarget as HTMLElement).getAttribute(
              "data-todo-id"
            );
            const sourceId = draggedId;

            if (dropTarget && sourceId && dropTarget !== sourceId) {
              // Get current order of todos
              const currentOrder = todos.map((t) => t.id);

              // Remove source from current position
              const newOrder = currentOrder.filter((id) => id !== sourceId);

              // Find target index and insert source after it
            }
          }}
        >
          <TodoCard todo={todo} onEdit={onEdit} />
        </div>
      ))}
    </div>
  );
}
