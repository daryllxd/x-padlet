'use client';

import { useTodoGroups } from '@/hooks/useTodoGroups';
import { TodoGroup, TodoItem } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { GroupedTodoHead } from './grouped-todo-head';
import { TodoCard } from './todo-card';

interface GroupedTodoListProps {
  todos: TodoItem[];
  listId: string;
}

export function GroupedTodoList({ todos, listId }: GroupedTodoListProps) {
  const { groups, createGroup, updateGroup } = useTodoGroups(listId);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

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

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      await createGroup(newGroupName.trim());
      setNewGroupName('');
      setIsCreatingGroup(false);
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {!isCreatingGroup ? (
          <button
            onClick={() => setIsCreatingGroup(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            <Plus className="h-5 w-5" />
            New Group
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
              className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateGroup();
                } else if (e.key === 'Escape') {
                  setIsCreatingGroup(false);
                  setNewGroupName('');
                }
              }}
              autoFocus
            />
            <button
              onClick={handleCreateGroup}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreatingGroup(false);
                setNewGroupName('');
              }}
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {groups.map((group: TodoGroup) => (
          <div key={group.id} className="min-w-[300px] space-y-4">
            <GroupedTodoHead todoListId={listId} group={group} />
            <div className="space-y-4">
              {groupedTodos[group.id]?.todos.map((todo) => (
                <TodoCard key={todo.id} todo={todo} listId={listId} />
              ))}
            </div>
          </div>
        ))}
        {groupedTodos['ungrouped'] && (
          <div className="min-w-[300px] space-y-4">
            <h3 className="text-lg font-semibold">Ungrouped</h3>
            <div className="space-y-4">
              {groupedTodos['ungrouped'].todos.map((todo) => (
                <TodoCard key={todo.id} todo={todo} listId={listId} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
