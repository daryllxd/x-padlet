'use client';

import { TodoItem } from '@/types';
import { TodoList } from '@/types/todo-list';
import { GroupedTodoList } from './grouped-todo-list';
import { MasonryTodoList } from './masonry-todo-list';

interface TodoListViewProps {
  todos: TodoItem[];
  listId: string;
  displayMode: TodoList['display_mode'];
  isLoading?: boolean;
}

export function TodoListView({ todos, listId, displayMode, isLoading }: TodoListViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayMode === 'masonry' ? (
        <MasonryTodoList todos={todos} listId={listId} />
      ) : (
        <GroupedTodoList todos={todos} listId={listId} />
      )}
    </div>
  );
}
