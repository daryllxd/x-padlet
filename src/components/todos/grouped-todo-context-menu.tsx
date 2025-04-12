'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { TodoGroup } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface GroupedTodoContextMenuRef {
  open: (x: number, y: number) => void;
}

interface GroupedTodoContextMenuProps {
  group: TodoGroup;
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

export const GroupedTodoContextMenu = forwardRef<
  GroupedTodoContextMenuRef,
  GroupedTodoContextMenuProps
>(function GroupedTodoContextMenu({ group, onEdit, onDelete, children }, ref) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    open: (x: number, y: number) => {
      const event = new MouseEvent('contextmenu', {
        bubbles: true,
        clientX: x,
        clientY: y,
      });
      triggerRef.current?.dispatchEvent(event);
    },
  }));

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div ref={triggerRef}>{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Group
        </ContextMenuItem>
        <ContextMenuItem className="text-red-600" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Group
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});
