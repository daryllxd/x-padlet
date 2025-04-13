'use client';

import { useTodoGroups } from '@/hooks/useTodoGroups';
import { TodoGroup, TodoItem } from '@/types';
import { GroupedTodoCreate } from './grouped-todo-create';
import { GroupedTodoHead } from './grouped-todo-head';
import { TodoCard } from './todo-card';

interface GroupedTodoListProps {
  todos: TodoItem[];
  listId: string;
}

export function GroupedTodoList({ todos, listId }: GroupedTodoListProps) {
  const { groups, isLoading } = useTodoGroups(listId);

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

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {groups.map((group: TodoGroup) => (
          <div key={group.id} className="w-[320px] space-y-4">
            <GroupedTodoHead todoListId={listId} group={group} />
            <GroupedTodoCreate todoListId={listId} todoGroupId={group.id} />
            <div className="grid w-[320px] gap-2">
              {groupedTodos[group.id]?.todos.map((todo) => (
                <TodoCard key={todo.id} todo={todo} listId={listId} />
              ))}
            </div>
          </div>
        ))}
        <div className="w-[320px] space-y-4">
          <GroupedTodoHead todoListId={listId} isCreate />
        </div>
      </div>
    </div>
  );
}
