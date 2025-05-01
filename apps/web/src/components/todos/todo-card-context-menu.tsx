'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Edit, Trash } from 'lucide-react';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface TodoCardContextMenuRef {
  open: (x: number, y: number) => void;
}

interface TodoCardContextMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export const TodoCardContextMenu = forwardRef<TodoCardContextMenuRef, TodoCardContextMenuProps>(
  ({ onEdit, onDelete, children, onOpenChange }, ref) => {
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
      <ContextMenu onOpenChange={onOpenChange}>
        <ContextMenuTrigger>
          <div ref={triggerRef}>{children}</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem onClick={onDelete} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }
);

TodoCardContextMenu.displayName = 'TodoCardContextMenu';
