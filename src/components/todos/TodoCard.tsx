'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodo } from '@/context/TodoContext';
import { cn } from '@/lib/utils';
import { TodoItem } from '@/types';
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Check, Edit, Trash, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { MarkdownContent } from '@/components/markdown/MarkdownContent';
import { EditTodoDialog } from '@/components/todos/EditTodoDialog';
import invariant from 'tiny-invariant';

interface TodoCardProps {
  todo: TodoItem;
  onEdit: (id: string) => void;
}

type DraggableState = {
  state: 'idle' | 'dragging' | 'draggedOver';
  closestEdge: 'left' | 'right' | null;
};

function useDraggableState() {
  const [state, setState] = useState<DraggableState>({
    state: 'idle',
    closestEdge: null,
  });

  const setDragging = () => {
    setState({ state: 'dragging', closestEdge: null });
  };

  const setDraggedOver = (edge: 'left' | 'right') => {
    setState({ state: 'draggedOver', closestEdge: edge });
  };

  const reset = () => {
    setState({ state: 'idle', closestEdge: null });
  };

  return { state, setDragging, setDraggedOver, reset };
}

// Add type guard for edge
function isHorizontalEdge(edge: Edge): edge is 'left' | 'right' {
  return edge === 'left' || edge === 'right';
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
    console.log(todo);
  }, [todo]);

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
          allowedEdges: ['left', 'right'],
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
        {state.closestEdge === 'left' && (
          <div className="absolute top-[8px] left-[-10px] h-[calc(100%-16px)] w-1 -translate-x-full transform bg-blue-500 opacity-50" />
        )}

        {state.closestEdge === 'right' && (
          <div className="absolute top-[8px] right-[-10px] h-[calc(100%-16px)] w-1 translate-x-full transform bg-blue-500 opacity-50" />
        )}

        <Card
          ref={ref}
          className={cn(
            'h-full w-full',
            todo.completed && 'border-2 bg-slate-50 opacity-75',
            state.state === 'dragging' &&
              'border-slate-300 bg-slate-200 opacity-50 [&>*]:opacity-0',
            state.state === 'draggedOver' && 'bg-slate-100'
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle
                className={cn(
                  'line-clamp-1 text-lg font-medium',
                  todo.completed && 'text-slate-500 line-through'
                )}
              >
                {todo.title}
              </CardTitle>
              <div className="flex space-x-1">
                <Button size="icon" variant="ghost" onClick={() => toggleComplete(todo.id)}>
                  {todo.completed ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => deleteTodo(todo.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setIsEditModalOpen(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MarkdownContent
              content={todo.description || ''}
              className={cn(
                'text-sm text-slate-700',
                todo.completed && 'text-slate-500 line-through'
              )}
            />
          </CardContent>
          <CardFooter className="mt-auto pt-0">
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
