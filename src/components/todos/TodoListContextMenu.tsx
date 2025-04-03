'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Copy, Link, Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface TodoListContextMenuProps {
  id: string;
  children: React.ReactNode;
}

export function TodoListContextMenu({ id, children }: TodoListContextMenuProps) {
  const copyLink = () => {
    const url = `${window.location.origin}/lists/${id}`;
    navigator.clipboard.writeText(url);
    toast('Link copied to clipboard');
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={copyLink}>
          <Link className="mr-2 h-4 w-4" />
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
        <ContextMenuItem className="text-red-600" onClick={() => toast('Delete clicked')}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
