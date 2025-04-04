'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTodos } from '@/hooks/useTodos';
import { TodoItem } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddTodoDialogProps {
  initialTodo?: TodoItem;
  isEditing?: boolean;
  listId: string;
}

export function AddTodoDialog({ initialTodo, listId, isEditing = false }: AddTodoDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTodo?.title || '');
  const [description, setDescription] = useState(initialTodo?.description || '');
  const [keepOpen, setKeepOpen] = useState(false);
  const { addTodo, updateTodo } = useTodos(listId);

  const resetForm = () => {
    setTitle('');
    setDescription('');
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast('Title is required');
      return;
    }

    if (isEditing && initialTodo) {
      updateTodo(initialTodo.id, { title, description });
      toast('Todo updated successfully');
    } else {
      addTodo({
        title,
        description,
        completed: false,
        todo_list_id: 'e74409d7-3e13-4760-8da2-49552b81a97a',
      });
      toast('Todo added successfully');
    }

    if (!keepOpen) {
      handleClose();
    } else {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!isEditing ? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Todo
          </Button>
        ) : (
          <div className="hidden">Edit Dialog</div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Todo title"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Todo description"
              rows={4}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="keep-open"
              checked={keepOpen}
              onCheckedChange={(checked) => setKeepOpen(checked as boolean)}
            />
            <label
              htmlFor="keep-open"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Keep dialog open after adding
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
