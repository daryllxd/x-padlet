'use client';

import { MarkdownContent } from '@/components/markdown/markdown-content';
import { TodoEditDialog } from '@/components/todos/todo-edit-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodos } from '@/hooks/useTodos';
import { cn } from '@/lib/utils';
import { TodoItem } from '@/types';
import { Check, Edit, Trash, X } from 'lucide-react';
import { useState } from 'react';
import { Draggable } from './draggable';

interface TodoCardProps {
  todo: TodoItem;
  listId: string;
}

export function TodoCard({ todo, listId }: TodoCardProps) {
  const { toggleTodo, deleteTodo } = useTodos(listId);
  const formattedDate = new Date(todo.created_at).toLocaleDateString();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const hoverClasses = cn(
    todo.theme === 'blue' && `hover:bg-blue-100`,
    todo.theme === 'green' && `hover:bg-green-100`,
    todo.theme === 'yellow' && `hover:bg-yellow-100`,
    todo.theme === 'purple' && `hover:bg-purple-100`,
    todo.theme === 'red' && `hover:bg-red-100`,
    !todo.theme && `hover:bg-slate-100`
  );

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
              state.state === 'draggedOver' && 'bg-slate-100',
              todo.theme === 'blue' && 'bg-blue-200 transition-colors hover:bg-blue-300',
              todo.theme === 'green' && 'bg-green-200 transition-colors hover:bg-green-300',
              todo.theme === 'yellow' && 'bg-yellow-200 transition-colors hover:bg-yellow-300',
              todo.theme === 'purple' && 'bg-purple-200 transition-colors hover:bg-purple-300',
              todo.theme === 'red' && 'bg-red-200 transition-colors hover:bg-red-300',
              !todo.theme && 'bg-slate-200 transition-colors hover:bg-slate-300'
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
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(hoverClasses)}
                    onClick={() => toggleTodo(todo.id)}
                  >
                    {todo.is_completed ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(hoverClasses)}
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(hoverClasses)}
                    onClick={() => setIsEditModalOpen(true)}
                  >
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
          </Card>

          <TodoEditDialog
            todo={todo}
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            listId={listId}
          />
        </>
      )}
    </Draggable>
  );
}
