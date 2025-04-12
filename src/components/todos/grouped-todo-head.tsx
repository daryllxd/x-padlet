'use client';

import { useTodoGroups } from '@/hooks/useTodoGroups';
import { TodoGroup } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface GroupedTodoHeadProps {
  group: TodoGroup;
  todoListId: string;
}

export function GroupedTodoHead({ group, todoListId }: GroupedTodoHeadProps) {
  const { deleteGroup, updateGroup } = useTodoGroups(todoListId);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this group?')) {
      try {
        await deleteGroup(group.id);
      } catch (error) {
        console.error('Failed to delete group:', error);
      }
    }
  };

  const onEdit = async () => {
    const newName = prompt('Enter new group name:', group.name);

    if (!newName) return;
    try {
      await updateGroup({ groupId: group.id, name: newName });
    } catch (error) {
      console.error('Failed to update group:', error);
    }
  };

  return (
    <div
      className="flex items-center justify-between rounded-lg bg-slate-300 px-4 py-4 lg:px-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-lg font-semibold">{group.name}</h3>
      {isHovered && (
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="rounded-lg p-1 hover:bg-gray-100" title="Edit group">
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg p-1 text-red-600 hover:bg-gray-100"
            title="Delete group"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
