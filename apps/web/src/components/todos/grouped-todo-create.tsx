'use client';

import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { TodoCreateDialog } from './todo-create-dialog';

interface GroupedTodoCreateProps {
  todoListId: string;
  todoGroupId: string;
}

export function GroupedTodoCreate({ todoListId, todoGroupId }: GroupedTodoCreateProps) {
  return (
    <>
      <TodoCreateDialog listId={todoListId} todoGroupId={todoGroupId}>
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
