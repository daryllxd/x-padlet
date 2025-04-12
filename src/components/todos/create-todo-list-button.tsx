'use client';

import { Button } from '@/components/ui/button';
import { PenIcon } from 'lucide-react';
import { useState } from 'react';
import { TodoListCreateDialog } from './todo-list-create-dialog';

export function CreateTodoListButton() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        className="group relative h-32 w-full cursor-pointer items-start justify-start overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-white p-6 text-left transition-all hover:border-indigo-500 hover:bg-indigo-50"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">Create New List</h3>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-200">
                <PenIcon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-sm text-slate-500">Start organizing your tasks in a new list</p>
          </div>
        </div>
      </Button>
      <TodoListCreateDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
