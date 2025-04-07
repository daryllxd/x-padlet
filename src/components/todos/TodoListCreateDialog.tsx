import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTodoList } from '@/hooks/useCreateTodoList';
import { useState } from 'react';
import { toast } from 'sonner';

interface TodoListCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TodoListCreateDialog({ isOpen, onClose }: TodoListCreateDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { mutate: createTodoList, isPending } = useCreateTodoList();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTodoList(
      { title, description },
      {
        onSuccess: (data) => {
          toast.success('Todo list created successfully');
          setTitle('');
          setDescription('');
          onClose();
        },
        onError: (error) => {
          toast.error('Failed to create todo list');
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="grid gap-4">
        <DialogHeader>
          <DialogTitle>Create New Todo List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter list title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter list description"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground rounded-md px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {isPending ? 'Creating...' : 'Create List'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
