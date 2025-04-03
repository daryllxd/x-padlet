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
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import invariant from "tiny-invariant";
import { EditTodoDialog } from "@/components/todos/EditTodoDialog";
import { MarkdownContent } from "@/components/markdown/MarkdownContent";

interface TodoCardProps {
  todo: TodoItem;
  onEdit: (id: string) => void;
}

type DraggableState = {
  state: "idle" | "dragging" | "draggedOver";
  closestEdge: "left" | "right" | null;
};

function useDraggableState() {
  const [state, setState] = useState<DraggableState>({
    state: "idle",
    closestEdge: null,
  });

  const setDragging = () => {
    setState({ state: "dragging", closestEdge: null });
  };

  const setDraggedOver = (edge: "left" | "right") => {
    setState({ state: "draggedOver", closestEdge: edge });
  };

  const reset = () => {
    setState({ state: "idle", closestEdge: null });
  };

  return { state, setDragging, setDraggedOver, reset };
}

// Add type guard for edge
function isHorizontalEdge(edge: Edge): edge is "left" | "right" {
  return edge === "left" || edge === "right";
}

export function TodoCard({ todo, onEdit }: TodoCardProps) {
  const { toggleComplete, deleteTodo, updateTodo } = useTodo();
  const formattedDate = new Date(todo.created_at).toLocaleDateString();
  const ref = useRef(null);
  const { state, setDragging, setDraggedOver, reset } = useDraggableState();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
      }),
      onDragStart: () => setDragging(),
      onDrop: () => reset(),
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: ({ input, element }) => {
        const data = {
          id: todo.id,
          title: todo.title,
          description: todo.description,
        };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ["left", "right"],
        });
      },
      onDragEnter: ({ self }) => {
        const closestEdge = extractClosestEdge(self.data);
        if (closestEdge && isHorizontalEdge(closestEdge)) {
          setDraggedOver(closestEdge);
        }
      },
      onDrop: () => reset(),
      onDragLeave: () => reset(),
    });
  }, []);

  const handleSaveEdit = (updates: { title: string; description: string }) => {
    updateTodo(todo.id, updates);
  };

  return (
    <>
      <div className="relative h-full">
        {state.closestEdge === "left" && (
          <div className="absolute left-[-10px] top-[8px] h-[calc(100%-16px)] w-1 bg-blue-500 opacity-50 transform -translate-x-full" />
        )}

        {state.closestEdge === "right" && (
          <div className="absolute right-[-10px] top-[8px] h-[calc(100%-16px)] w-1 bg-blue-500 opacity-50 transform translate-x-full" />
        )}

        <Card
          ref={ref}
          className={cn(
            "h-full w-full",
            todo.completed && "opacity-75 bg-slate-50 border-2",
            state.state === "dragging" &&
              "opacity-50 bg-slate-200 [&>*]:opacity-0 border-slate-300",
            state.state === "draggedOver" && "bg-slate-100"
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
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MarkdownContent
              content={todo.description || ""}
              className={cn(
                "text-sm text-slate-700",
                todo.completed && "line-through text-slate-500"
              )}
            />
          </CardContent>
          <CardFooter className="pt-0 mt-auto">
            <p className="text-xs text-slate-500">Created: {formattedDate}</p>
          </CardFooter>
        </Card>
      </div>

      <EditTodoDialog
        todo={todo}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveEdit}
      />
    </>
  );
}
