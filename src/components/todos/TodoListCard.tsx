import { Card } from '@/components/ui/card';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { TodoListContextMenu, TodoListContextMenuRef } from './TodoListContextMenu';

interface TodoListCardProps {
  id: string;
  title: string;
  description?: string;
  todoCount: number;
}

export function TodoListCard({ id, title, description, todoCount }: TodoListCardProps) {
  const contextMenuRef = useRef<TodoListContextMenuRef>(null);

  const handleEllipsisClick = (e: React.MouseEvent) => {
    console.log('outside contextMenuRef', contextMenuRef.current);

    e.preventDefault();
    // Get the click position and open the context menu there
    contextMenuRef.current?.open(e.clientX, e.clientY);
  };

  return (
    <TodoListContextMenu id={id} ref={contextMenuRef}>
      <Link href={`/lists/${id}`}>
        <Card className="group hover:bg-accent/50 relative h-full p-6 transition-colors">
          <button
            onClick={handleEllipsisClick}
            className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <EllipsisVertical className="text-muted-foreground hover:text-foreground h-4 w-4 hover:cursor-pointer" />
          </button>
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h2 className="line-clamp-1 text-xl font-semibold">{title}</h2>
            </div>
            {description && (
              <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
            )}
            <div className="text-muted-foreground text-sm">
              {todoCount} {todoCount === 1 ? 'todo' : 'todos'}
            </div>
          </div>
        </Card>
      </Link>
    </TodoListContextMenu>
  );
}
