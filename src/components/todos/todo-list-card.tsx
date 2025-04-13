'use client';

import { Card } from '@/components/ui/card';
import { TodoListWithCreating } from '@/types/todo';
import { EllipsisVertical, Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '../ui/button';
import { XPadletLink } from '../ui/link';
import { TodoListContextMenu, TodoListContextMenuRef } from './todo-list-context-menu';

interface TodoListCardProps {
  todoList: TodoListWithCreating;
}

export function TodoListCard({ todoList }: TodoListCardProps) {
  const contextMenuRef = useRef<TodoListContextMenuRef>(null);
  const { id, title, description } = todoList;

  const handleEllipsisClick = (e: React.MouseEvent) => {
    e.preventDefault();
    contextMenuRef.current?.open(e.clientX, e.clientY);
  };

  if (todoList.status === 'creating') {
    return (
      <Card className="group bg-muted/50 relative h-full cursor-not-allowed p-6 transition-colors">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
        <div className="space-y-2 opacity-50">
          <div className="flex items-start justify-between">
            <h2 className="line-clamp-1 text-xl font-semibold">{title}</h2>
          </div>
          {description && (
            <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <TodoListContextMenu todoList={todoList} ref={contextMenuRef}>
      <XPadletLink target="_blank" href={`/${id}`} variant="muted">
        <Card className="group hover:bg-accent/50 relative h-full p-6 transition-colors">
          <Button
            variant={'ghost'}
            onClick={handleEllipsisClick}
            className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <EllipsisVertical className="text-muted-foreground hover:text-foreground h-4 w-4 hover:cursor-pointer" />
          </Button>
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h2 className="line-clamp-1 text-xl font-semibold">{title}</h2>
            </div>
            {description && (
              <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
            )}
          </div>
        </Card>
      </XPadletLink>
    </TodoListContextMenu>
  );
}
