'use client';

import { TodoItem } from '@/types';
import { TodoList } from '@/types/todo-list';
import { GroupedTodoList } from './grouped-todo-list';
import { MasonryTodoList } from './masonry-todo-list';

interface TodoListViewProps {
  todos: TodoItem[];
  listId: string;
  displayMode: TodoList['display_mode'];
}

export function TodoListView({ todos, listId, displayMode }: TodoListViewProps) {
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
