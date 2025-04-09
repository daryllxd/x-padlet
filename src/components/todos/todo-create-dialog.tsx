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

interface TodoCreateDialogProps {
  initialTodo?: TodoItem;
  isEditing?: boolean;
  listId: string;
}

export function TodoCreateDialog({
  initialTodo,
  listId,
  isEditing = false,
}: TodoCreateDialogProps) {
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
      toast.error('Title is required');
      return;
    }

    if (isEditing && initialTodo) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      updateTodo(initialTodo.id, formData);
      toast.success(`Todo "${title}" updated successfully`);
    } else {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('todo_list_id', listId);
      formData.append('is_completed', 'false');
      addTodo(formData);
      toast.success(`Todo "${title}" added successfully`);
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
              placeholder="Enter todo title"
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
              placeholder="Enter todo description"
              rows={4}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="keepOpen"
              checked={keepOpen}
              onCheckedChange={(checked) => setKeepOpen(checked as boolean)}
            />
            <label
              htmlFor="keepOpen"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Keep dialog open
            </label>
          </div>
          <DialogFooter>
            <Button type="submit">{isEditing ? 'Update' : 'Add'} Todo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
