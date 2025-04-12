'use client';

import { TodoItem } from '@/types';
import { TodoCard } from './todo-card';

interface GroupedTodoListProps {
  todos: TodoItem[];
  listId: string;
}

export function GroupedTodoList({ todos, listId }: GroupedTodoListProps) {
  // Group todos by their group_id
  const groupedTodos = todos.reduce(
    (acc, todo) => {
      const groupId = todo.todo_group_id || 'ungrouped';
      if (!acc[groupId]) {
        acc[groupId] = {
          name: todo.todo_group_name || 'Ungrouped',
          todos: [],
        };
      }
      acc[groupId].todos.push(todo);
      return acc;
    },
    {} as Record<string, { name: string; todos: TodoItem[] }>
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(groupedTodos).map(([groupId, group]) => (
        <div key={groupId} className="space-y-4">
          <h3 className="text-lg font-semibold">{group.name}</h3>
          <div className="space-y-4">
            {group.todos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} listId={listId} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
