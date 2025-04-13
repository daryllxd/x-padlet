'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCreateTodo } from '@/hooks/todos/useCreateTodo';
import { Plus } from 'lucide-react';
import { ComponentProps, useRef, useState } from 'react';
import { toast } from 'sonner';
import { TodoDialog, TodoDialogRef } from './todo-dialog';

interface TodoCreateDialogProps extends ComponentProps<typeof Dialog> {
  listId: string;
  todoGroupId?: string;
}

export function TodoCreateDialog({ listId, children, todoGroupId }: TodoCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<TodoDialogRef>(null);
  const createTodo = useCreateTodo({ listId });

  const handleSave = async (formData: FormData) => {
    formData.append('todo_list_id', listId);
    if (todoGroupId) {
      formData.append('todo_group_id', todoGroupId);
    }
    formData.append('is_completed', 'false');

    try {
      await createTodo.mutateAsync(formData);
      toast.success('Todo created successfully');
      setOpen(false);
      dialogRef.current?.resetForm();
    } catch (error) {
      console.error('Error creating todo:', error);
      toast.error('Failed to create todo');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add to list</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new todo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Todo</DialogTitle>
        </DialogHeader>
        <TodoDialog
          ref={dialogRef}
          open={open}
          onOpenChange={setOpen}
          onSave={handleSave}
          todo={null}
          mode="create"
        />
      </DialogContent>
    </Dialog>
  );
}
