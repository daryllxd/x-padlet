import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface TodoListCardProps {
  id: string;
  title: string;
  description?: string;
  todoCount: number;
}

export function TodoListCard({ id, title, description, todoCount }: TodoListCardProps) {
  return (
    <Link href={`/${id}`}>
      <Card className="hover:bg-accent/50 cursor-pointer p-6 transition-colors">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
          <div className="text-muted-foreground text-sm">
            {todoCount} {todoCount === 1 ? 'todo' : 'todos'}
          </div>
        </div>
      </Card>
    </Link>
  );
}
