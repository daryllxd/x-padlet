import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTodoList } from '@/hooks/useCreateTodoList';
import { ImageIcon, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface TodoListCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TodoListCreateDialog({ isOpen, onClose }: TodoListCreateDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createTodoList, isPending } = useCreateTodoList();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTodoList(
      { title, description },
      {
        onSuccess: (data) => {
          toast.success(
            <span>
              Todo list <span className="font-bold">{data.title}</span> created successfully
            </span>
          );
          setTitle('');
          setDescription('');
          setImagePreview(null);
          onClose();
        },
        onError: (error) => {
          toast.error('Failed to create todo list. Please try again.');
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      debugger;
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

          <div className="space-y-2">
            <Label>Cover Image (optional)</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-full rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 rounded-full bg-white/80 p-1 hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-4 hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">Click to add a cover image</p>
                <p className="mt-1 text-xs text-gray-400">Max 5MB</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
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
