import { Card } from '@/components/ui/card';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';
import { TodoListContextMenu } from './TodoListContextMenu';

interface TodoListCardProps {
  id: string;
  title: string;
  description?: string;
  todoCount: number;
}

export function TodoListCard({ id, title, description, todoCount }: TodoListCardProps) {
  return (
    <TodoListContextMenu id={id}>
      <Link href={`/${id}`}>
        <Card className="group hover:bg-accent/50 h-full p-6 transition-colors">
          <div className="relative space-y-2">
            <div className="flex items-start justify-between">
              <h2 className="line-clamp-1 text-xl font-semibold">{title}</h2>
            </div>
            {description && (
              <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
            )}
            <div className="text-muted-foreground mb-0 text-sm">
              {todoCount} {todoCount === 1 ? 'todo' : 'todos'}
            </div>
            <EllipsisVertical className="text-muted-foreground absolute right-0 bottom-0 h-4 w-4" />
          </div>
        </Card>
      </Link>
    </TodoListContextMenu>
  );
}
