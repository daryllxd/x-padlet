'use client';

import { useTodos } from '@/hooks/useTodos';
import { TodoItem } from '@/types';
import { toast } from 'sonner';
import { TodoDialog } from './todo-dialog';

interface TodoEditDialogProps {
  todo: TodoItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
}

export function TodoEditDialog({ todo, open, onOpenChange, listId }: TodoEditDialogProps) {
  const { updateTodo } = useTodos(listId);

  const handleSave = async (formData: FormData) => {
    try {
      await updateTodo(todo.id, formData);
      toast.success('Todo updated successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update todo');
    }
  };

  return (
    <TodoDialog
      todo={todo}
      open={open}
      onOpenChange={onOpenChange}
      onSave={handleSave}
      mode="edit"
    />
  );
}
