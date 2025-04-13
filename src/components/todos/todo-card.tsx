'use client';

import { MarkdownContent } from '@/components/markdown/markdown-content';
import { TodoEditDialog } from '@/components/todos/todo-edit-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodos } from '@/hooks/useTodos';
import { cn } from '@/lib/utils';
import { getTodoHoverClasses, getTodoThemeStyles } from '@/lib/utils/todo-theme';
import { TodoItem } from '@/types';
import { Check, EllipsisVertical, X } from 'lucide-react';
import { ComponentProps, useRef, useState } from 'react';
import { TodoCardContextMenu, TodoCardContextMenuRef } from './todo-card-context-menu';
interface TodoCardProps extends ComponentProps<typeof Card> {
  todo: TodoItem;
  listId: string;
}

export function TodoCard({ todo, listId, className, ...props }: TodoCardProps) {
  const { toggleTodo, deleteTodo } = useTodos(listId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const contextMenuRef = useRef<TodoCardContextMenuRef>(null);

  const handleEllipsisClick = (e: React.MouseEvent) => {
    e.preventDefault();
    contextMenuRef.current?.open(e.clientX, e.clientY);
  };

  return (
    <TodoCardContextMenu
      ref={contextMenuRef}
      onEdit={() => setIsEditModalOpen(true)}
      onDelete={() => deleteTodo(todo.id)}
      onOpenChange={setContextMenuOpen}
    >
      <Card
        className={cn(
          'h-full w-full',
          'hover:cursor-pointer',
          todo.is_completed && 'border-2 bg-slate-50 opacity-75',
          getTodoThemeStyles(todo.theme, contextMenuOpen),
          className
        )}
        onDoubleClick={() => setIsEditModalOpen(true)}
        {...props}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle
              className={cn(
                'text-lg font-medium',
                todo.is_completed && 'text-slate-500 line-through'
              )}
            >
              {todo.title}
            </CardTitle>
            <div className="flex space-x-1">
              <Button
                size="icon"
                variant="ghost"
                className={cn(getTodoHoverClasses(todo.theme))}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.is_completed ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className={cn(getTodoHoverClasses(todo.theme))}
                onClick={handleEllipsisClick}
              >
                <EllipsisVertical className="h-4 w-4" />
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
    </TodoCardContextMenu>
  );
}
