'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useArchiveTodoList } from '@/hooks/useArchiveTodoList';
import { Archive, Clipboard, Copy, Link, Pencil } from 'lucide-react';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { toast } from 'sonner';

// Export the interface so other components can use it
export interface TodoListContextMenuRef {
  open: (x: number, y: number) => void;
}

interface TodoListContextMenuProps {
  id: string;
  children: React.ReactNode;
}

export const TodoListContextMenu = forwardRef<TodoListContextMenuRef, TodoListContextMenuProps>(
  function TodoListContextMenu({ id, children }, ref) {
    const triggerRef = useRef<HTMLDivElement>(null);
    const { mutate: archiveTodoList } = useArchiveTodoList();

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

    const copyLink = () => {
      const url = `${window.location.origin}/${id}`;
      navigator.clipboard.writeText(url);
      toast('Link copied to clipboard');
    };

    const handleArchive = () => {
      archiveTodoList(id, {
        onSuccess: () => {
          toast.success('Todo list archived');
        },
        onError: () => {
          toast.error('Failed to archive todo list');
        },
      });
    };

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div ref={triggerRef}>{children}</div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => window.open(`/${id}`, '_blank')}>
            <Link className="mr-2 h-4 w-4" />
            Open in new tab
          </ContextMenuItem>
          <ContextMenuItem onClick={copyLink}>
            <Clipboard className="mr-2 h-4 w-4" />
            Copy Link
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate List
          </ContextMenuItem>
          <ContextMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem className="text-red-600">
            <button
              onClick={handleArchive}
              className="hover:bg-accent hover:text-accent-foreground flex w-full items-center space-x-2 rounded-sm text-sm outline-none"
            >
              <Archive className="mr-4 h-4 w-4" />
              <span>Archive</span>
            </button>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }
);
