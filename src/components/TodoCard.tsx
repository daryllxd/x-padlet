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

interface TodoCardProps {
  todo: TodoItem;
  onEdit: (id: string) => void;
}

export function TodoCard({ todo, onEdit }: TodoCardProps) {
  const { toggleComplete, deleteTodo } = useTodo();
  const formattedDate = new Date(todo.created_at).toLocaleDateString();

  return (
    <Card className={cn("w-full", todo.completed && "opacity-75 bg-slate-50")}>
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
