'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useTodos } from '@/hooks/useTodos';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { TodoDialog } from './todo-dialog';

interface TodoCreateDialogProps {
  listId: string;
}

export function TodoCreateDialog({ listId }: TodoCreateDialogProps) {
  const [open, setOpen] = useState(false);

  const { addTodo } = useTodos(listId);

  const handleSave = async (formData: FormData) => {
    formData.append('todo_list_id', listId);
    formData.append('is_completed', 'false');

    try {
      await addTodo(formData);
      toast.success('Todo created successfully');
      setOpen(false);
    } catch (error) {
      console.error('Error creating todo:', error);
      toast.error('Failed to create todo');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Todo
        </Button>
      </DialogTrigger>
      <TodoDialog open={open} onOpenChange={setOpen} onSave={handleSave} mode="create" />
    </Dialog>
  );
}
