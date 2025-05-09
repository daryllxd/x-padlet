'use client';

import { useTodoGroupMutations } from '@/hooks/todo-groups/useTodoGroupMutations';
import { cn } from '@/lib/utils';
import { TodoGroup } from '@x-padlet/types';
import { EllipsisVertical, Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { GroupedTodoContextMenu, GroupedTodoContextMenuRef } from './grouped-todo-context-menu';

interface GroupedTodoHeadProps {
  group?: TodoGroup;
  todoListId: string;
  isCreate?: boolean;
}

export function GroupedTodoHead({ group, todoListId, isCreate = false }: GroupedTodoHeadProps) {
  const { deleteGroupMutation, updateGroupMutation, createGroupMutation } =
    useTodoGroupMutations(todoListId);
  const [isHovered, setIsHovered] = useState(false);
  const contextMenuRef = useRef<GroupedTodoContextMenuRef>(null);

  const handleEllipsisClick = (e: React.MouseEvent) => {
    e.preventDefault();
    contextMenuRef.current?.open(e.clientX, e.clientY);
  };

  const handleCreateGroup = async () => {
    if (createGroupMutation.isPending) return;

    try {
      await createGroupMutation.mutateAsync('New Group');
      toast.success('Group created successfully');
    } catch (error) {
      console.error('Failed to create group:', error);
      toast.error('Failed to create group');
    }
  };

  const handleDelete = async () => {
    if (!group) return;
    if (confirm('Are you sure you want to delete this group?')) {
      try {
        await deleteGroupMutation.mutateAsync(group.id);

        toast.success('Group deleted successfully');
      } catch (error) {
        console.error('Failed to delete group:', error);
        toast.error('Failed to delete group');
      }
    }
  };

  const onEdit = async () => {
    if (!group) return;
    const newName = prompt('Enter new group name:', group.name);

    if (!newName) return;
    try {
      await updateGroupMutation.mutateAsync({ groupId: group.id, name: newName });
      toast.success('Group updated successfully');
    } catch (error) {
      console.error('Failed to update group:', error);
      toast.error('Failed to update group');
    }
  };

  if (isCreate) {
    return (
      <div
        className={cn(
          'group mt-2 flex h-12 items-center justify-center rounded-lg bg-slate-300 px-4 py-4 lg:px-6',
          createGroupMutation.isPending && 'opacity-50'
        )}
        onClick={handleCreateGroup}
      >
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-8 w-8 rounded-lg p-1',
            !createGroupMutation.isPending && 'group-hover:bg-gray-100',
            createGroupMutation.isPending && 'opacity-50'
          )}
          disabled={createGroupMutation.isPending}
        >
          {createGroupMutation.isPending ? (
            <>Creating group...</>
          ) : (
            <Plus className="mx-auto h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  if (!group) return null;

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
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEllipsisClick}
          className="h-8 w-8 rounded-lg p-1 pr-0 group-hover:bg-gray-100"
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </div>
    </GroupedTodoContextMenu>
  );
}
