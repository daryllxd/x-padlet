"use client";

import { TodoItem } from "@/types";
import { useTodo } from "@/context/TodoContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Trash, Edit, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import invariant from "tiny-invariant";
interface TodoCardProps {
  todo: TodoItem;
  onEdit: (id: string) => void;
}

export function TodoCard({ todo, onEdit }: TodoCardProps) {
  const { toggleComplete, deleteTodo } = useTodo();
  const formattedDate = new Date(todo.created_at).toLocaleDateString();
  const ref = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false); // NEW
  const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false);
  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => {
        return {
          id: todo.id,
          title: todo.title,
          description: todo.description,
        };
      },
      onDragStart: (e) => {
        setDragging(true);
      },
      onDrop: () => setDragging(false), // NEW
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => {
        return {
          id: todo.id,
          title: todo.title,
          description: todo.description,
        };
      },
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: (e) => {
        setIsDraggedOver(false);
      },
    });
  }, []);

  return (
    <Card
      ref={ref}
      className={cn(
        "w-full",
        todo.completed && "opacity-75 bg-slate-50 border-2",
        dragging && "opacity-50 bg-slate-200 [&>*]:opacity-0 border-slate-300",
        !dragging && isDraggedOver && "bg-red-100"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle
            className={cn(
              "text-lg font-medium line-clamp-1",
              todo.completed && "line-through text-slate-500"
            )}
          >
            {todo.title}
          </CardTitle>
          <div className="flex space-x-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => toggleComplete(todo.id)}
            >
              {todo.completed ? (
                <X className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => deleteTodo(todo.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onEdit(todo.id)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-sm text-slate-700",
            todo.completed && "line-through text-slate-500"
          )}
        >
          {todo.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-slate-500">Created: {formattedDate}</p>
      </CardFooter>
    </Card>
  );
}
