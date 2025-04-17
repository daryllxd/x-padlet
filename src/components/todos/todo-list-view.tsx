'use client';

import { Button } from '@/components/ui/button';
import { TodoItem } from '@/types';
import { TodoList } from '@/types/todo-list';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { useState } from 'react';
import { GroupedTodoList } from './grouped-todo-list';
import { MasonryTodoList } from './masonry-todo-list';

interface TodoListViewProps {
  todos: TodoItem[];
  listId: string;
  displayMode: TodoList['display_mode'];
}

export function TodoListView({ todos, listId, displayMode }: TodoListViewProps) {
  const [viewType, setViewType] = useState<TodoList['display_mode']>(displayMode);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewType('masonry')}
          className={viewType === 'masonry' ? 'bg-slate-200 hover:bg-slate-300' : ''}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewType('columnar')}
          className={viewType === 'columnar' ? 'bg-slate-200 hover:bg-slate-300' : ''}
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
