'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { TodoListCreateDialog } from './todo-list-create-dialog';

export function CreateTodoListButton() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
      >
        Create New List
      </Button>

      <TodoListCreateDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
