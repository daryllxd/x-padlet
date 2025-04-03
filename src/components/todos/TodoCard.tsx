'use client';

import { MarkdownContent } from '@/components/markdown/MarkdownContent';
import { EditTodoDialog } from '@/components/todos/EditTodoDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodo } from '@/context/TodoContext';
import { cn } from '@/lib/utils';
import { TodoItem } from '@/types';
import { Check, Edit, Trash, X } from 'lucide-react';
import { useState } from 'react';
import { Draggable } from './Draggable';

interface TodoCardProps {
  todo: TodoItem;
  onEdit: (id: string) => void;
}

export function TodoCard({ todo, onEdit }: TodoCardProps) {
  const { toggleComplete, deleteTodo, updateTodo } = useTodo();
  const formattedDate = new Date(todo.created_at).toLocaleDateString();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveEdit = (updates: { title: string; description: string }) => {
    updateTodo(todo.id, updates);
  };

  return (
    <Draggable todo={todo}>
      {(state) => (
        <>
          <Card
            className={cn(
              'h-full w-full',
              'hover:cursor-pointer',
              todo.completed && 'border-2 bg-slate-50 opacity-75',
              state.state === 'dragging' &&
                'border-slate-300 bg-slate-200 opacity-50 [&>*]:opacity-0',
              state.state === 'draggedOver' && 'bg-slate-100'
            )}
            onDoubleClick={() => setIsEditModalOpen(true)}
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

          <EditTodoDialog
            todo={todo}
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            onSave={handleSaveEdit}
          />
        </>
      )}
    </Draggable>
  );
}
