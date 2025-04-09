'use client';

import { MarkdownContent } from '@/components/markdown/markdown-content';
import { TodoEditDialog } from '@/components/todos/todo-edit-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodos } from '@/hooks/useTodos';
import { cn } from '@/lib/utils';
import { TodoItem } from '@/types';
import { Check, Edit, Trash, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Draggable } from './draggable';

interface TodoCardProps {
  todo: TodoItem;
  listId: string;
}

export function TodoCard({ todo, listId }: TodoCardProps) {
  const { toggleTodo, deleteTodo, updateTodo } = useTodos(listId);
  const formattedDate = new Date(todo.created_at).toLocaleDateString();
  const [isEditModalOpen, setIsEditModalOpen] = useState(true);

  const handleSaveEdit = async (updates: {
    title: string;
    description: string;
    image_url?: string | null;
    imageFile?: File | null;
  }) => {
    const formData = new FormData();
    formData.append('title', updates.title);
    formData.append('description', updates.description);
    if (updates.image_url !== undefined) {
      formData.append('image_url', updates.image_url || '');
    }
    if (updates.imageFile) {
      formData.append('image', updates.imageFile);
    }
    try {
      await updateTodo(todo.id, formData);
      toast.success('Todo updated successfully');
    } catch (error) {
      toast.error('Failed to update todo');
    }
  };

  return (
    <Draggable todo={todo}>
      {(state) => (
        <>
          <Card
            className={cn(
              'h-full w-full',
              'hover:cursor-pointer',
              todo.is_completed && 'border-2 bg-slate-50 opacity-75',
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
                    todo.is_completed && 'text-slate-500 line-through'
                  )}
                >
                  {todo.title}
                </CardTitle>
                <div className="flex space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => toggleTodo(todo.id)}>
                    {todo.is_completed ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
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
            <CardContent className="grid gap-2">
              {todo.image_url && (
                <img src={todo.image_url} alt="Todo" className="h-full w-full rounded-xl" />
              )}
              <MarkdownContent
                content={todo.description || ''}
                className={cn(
                  'text-sm text-slate-700',
                  todo.is_completed && 'text-slate-500 line-through'
                )}
              />
            </CardContent>
            <CardFooter className="mt-auto pt-0">
              <p className="text-xs text-slate-500">Created: {formattedDate}</p>
            </CardFooter>
          </Card>

          <TodoEditDialog
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
