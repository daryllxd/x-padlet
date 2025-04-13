'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useTodos } from '@/hooks/useTodos';
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

  const { addTodo } = useTodos(listId);

  const handleSave = async (formData: FormData) => {
    formData.append('todo_list_id', listId);
    if (todoGroupId) {
      formData.append('todo_group_id', todoGroupId);
    }
    formData.append('is_completed', 'false');

    try {
      await addTodo(formData);
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
          <Button>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add to list</span>
          </Button>
        )}
      </DialogTrigger>
      <TodoDialog
        ref={dialogRef}
        open={open}
        onOpenChange={setOpen}
        onSave={handleSave}
        todo={null}
        mode="create"
      />
    </Dialog>
  );
}
