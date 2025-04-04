'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Clipboard, Copy, Link, Pencil, Trash } from 'lucide-react';
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

    useImperativeHandle(ref, () => ({
      open: (x: number, y: number) => {
        console.log('inside contextMenuRef', triggerRef.current);

        // Need x and y to open the context menu at the correct position, otherwise it opens at the top left of the screen
        const event = new MouseEvent('contextmenu', {
          bubbles: true,
          clientX: x,
          clientY: y,
        });
        triggerRef.current?.dispatchEvent(event);
      },
    }));

    const copyLink = () => {
      const url = `${window.location.origin}/lists/${id}`;
      navigator.clipboard.writeText(url);
      toast('Link copied to clipboard');
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
            <Trash className="mr-2 h-4 w-4" />
            Archive
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }
);
