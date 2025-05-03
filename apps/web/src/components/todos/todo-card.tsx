'use client';

import { MarkdownContent } from '@/components/markdown/markdown-content';
import { TodoEditDialog } from '@/components/todos/todo-edit-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodos } from '@/hooks/useTodos';
import { cn } from '@/lib/utils';
import { extractUrls } from '@/lib/utils/extract-urls';
import { getTodoHoverClasses, getTodoThemeStyles } from '@/lib/utils/todo-theme';
import { TodoItem } from '@x-padlet/types';
import { EllipsisVertical } from 'lucide-react';
import { ComponentProps, useRef, useState } from 'react';
import LinkPreview from '../ui/link-preview/link-preview';
import { TodoCardContextMenu, TodoCardContextMenuRef } from './todo-card-context-menu';

interface TodoCardProps extends ComponentProps<typeof Card> {
  todo: TodoItem;
  listId: string;
}

export function TodoCard({ todo, listId, className, ...props }: TodoCardProps) {
  const { deleteTodo } = useTodos(listId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const contextMenuRef = useRef<TodoCardContextMenuRef>(null);

  const hasImageOrDescription = todo.image_url || todo.description;

  // Extract URLs and clean description
  const urls = extractUrls(todo.description || '');
  const cleanDescription = (todo.description || '')
    .replace(/(?<!\()(?<!\[.*\]\()(https?:\/\/[^\s<]+[^<.,:;"')\]\s])(?!\))/g, '')
    .trim();

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
        <CardHeader className={cn({ 'pb-2': hasImageOrDescription })}>
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
                onClick={handleEllipsisClick}
              >
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {hasImageOrDescription ? (
          <CardContent className="flex flex-col gap-4">
            {todo.image_url && (
              <img
                src={todo.image_url}
                alt={`${todo.title} image`}
                className="h-full w-full object-contain lg:max-h-[300px]"
                loading="lazy"
              />
            )}
            {cleanDescription && (
              <MarkdownContent
                content={cleanDescription}
                className={cn(
                  'text-sm text-slate-700',
                  todo.is_completed && 'text-slate-500 line-through'
                )}
              />
            )}
            {/* Link Previews */}
            {urls.length > 0 && (
              <div className="space-y-3">
                {urls.map((url, index) => (
                  <LinkPreview
                    key={`${url}-${index}`}
                    url={url}
                    className={cn('transition-opacity', todo.is_completed && 'opacity-75')}
                  />
                ))}
              </div>
            )}
          </CardContent>
        ) : null}
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
