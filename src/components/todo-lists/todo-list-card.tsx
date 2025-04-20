'use client';

import { Card } from '@/components/ui/card';
import { EllipsisVertical } from 'lucide-react';
import React, { ComponentProps, useRef } from 'react';
import { Button } from '../ui/button';
import { XPadletLink } from '../ui/link';
import { TodoListContextMenu, TodoListContextMenuRef } from './todo-list-context-menu';

interface TodoListCardProps extends ComponentProps<typeof Card> {
  id?: string;
  title: string;
  description?: string;
  href?: string;
}

export function TodoListCard({
  id,
  title,
  description,
  href = undefined,
  children,
}: TodoListCardProps) {
  const contextMenuRef = useRef<TodoListContextMenuRef>(null);

  const handleEllipsisClick = (e: React.MouseEvent) => {
    e.preventDefault();
    contextMenuRef.current?.open(e.clientX, e.clientY);
  };

  const CardContent = (
    <XPadletLink target="_blank" href={href ?? `/${id}`} variant="muted">
      <Card className="group hover:bg-accent/50 relative h-full p-6 transition-colors">
        {id && (
          <Button
            variant={'ghost'}
            onClick={handleEllipsisClick}
            className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <EllipsisVertical className="text-muted-foreground hover:text-foreground h-4 w-4 hover:cursor-pointer" />
          </Button>
        )}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h2 className="line-clamp-1 text-xl font-semibold">{title}</h2>
          </div>
          {description && (
            <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
          )}
          {children}
        </div>
      </Card>
    </XPadletLink>
  );

  return id ? (
    <TodoListContextMenu todoList={{ id, title, description }} ref={contextMenuRef}>
      {CardContent}
    </TodoListContextMenu>
  ) : (
    CardContent
  );
}
