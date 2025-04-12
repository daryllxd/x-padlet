'use client';

import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { TodoCreateDialog } from './todo-create-dialog';

interface GroupedTodoCreateProps {
  todoListId: string;
  groupId: string;
}

export function GroupedTodoCreate({ todoListId, groupId }: GroupedTodoCreateProps) {
  return (
    <>
      <TodoCreateDialog listId={todoListId}>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center gap-2 bg-amber-300 hover:cursor-pointer hover:bg-amber-400"
          aria-label="Add Todo for this group"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </TodoCreateDialog>
    </>
  );
}
