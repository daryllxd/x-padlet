'use client';

import { useTodoGroups } from '@/hooks/useTodoGroups';
import { TodoGroup } from '@/types';
import { EllipsisVertical } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { GroupedTodoContextMenu, GroupedTodoContextMenuRef } from './grouped-todo-context-menu';

interface GroupedTodoHeadProps {
  group: TodoGroup;
  todoListId: string;
}

export function GroupedTodoHead({ group, todoListId }: GroupedTodoHeadProps) {
  const { deleteGroup, updateGroup } = useTodoGroups(todoListId);
  const [isHovered, setIsHovered] = useState(false);
  const contextMenuRef = useRef<GroupedTodoContextMenuRef>(null);

  const handleEllipsisClick = (e: React.MouseEvent) => {
    e.preventDefault();
    contextMenuRef.current?.open(e.clientX, e.clientY);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this group?')) {
      try {
        await deleteGroup(group.id);
        toast.success('Group deleted successfully');
      } catch (error) {
        console.error('Failed to delete group:', error);
        toast.error('Failed to delete group');
      }
    }
  };

  const onEdit = async () => {
    const newName = prompt('Enter new group name:', group.name);

    if (!newName) return;
    try {
      await updateGroup({ groupId: group.id, name: newName });
      toast.success('Group updated successfully');
    } catch (error) {
      console.error('Failed to update group:', error);
      toast.error('Failed to update group');
    }
  };

  return (
    <GroupedTodoContextMenu
      group={group}
      onEdit={onEdit}
      onDelete={handleDelete}
      ref={contextMenuRef}
    >
      <div
        className="group flex h-16 items-center justify-between rounded-lg bg-slate-300 px-4 py-4 lg:px-6"
        onClick={(e) => contextMenuRef.current?.open(e.clientX, e.clientY)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h3 className="text-lg font-semibold">{group.name}</h3>
        {isHovered && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEllipsisClick}
            className="h-8 w-8 rounded-lg p-1 group-hover:bg-gray-100"
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        )}
      </div>
    </GroupedTodoContextMenu>
  );
}
