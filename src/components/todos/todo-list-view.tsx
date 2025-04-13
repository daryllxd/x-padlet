'use client';

import { Button } from '@/components/ui/button';
import { TodoItem } from '@/types';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { useState } from 'react';
import { GroupedTodoList } from './grouped-todo-list';
import { MasonryTodoList } from './masonry-todo-list';

type TodoListViewType = 'masonry' | 'columnar';

interface TodoListViewProps {
  todos: TodoItem[];
  listId: string;
}

export function TodoListView({ todos, listId }: TodoListViewProps) {
  const [viewType, setViewType] = useState<TodoListViewType>('columnar');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewType('masonry')}
          className={viewType === 'masonry' ? 'bg-accent' : ''}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewType('columnar')}
          className={viewType === 'columnar' ? 'bg-accent' : ''}
        >
          <LayoutList className="h-4 w-4" />
        </Button>
      </div>

      {viewType === 'masonry' ? (
        <MasonryTodoList todos={todos} listId={listId} />
      ) : (
        <GroupedTodoList todos={todos} listId={listId} />
      )}
    </div>
  );
}
