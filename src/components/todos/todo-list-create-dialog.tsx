import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTodoList } from '@/hooks/useCreateTodoList';
import { X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { FileUploader } from '../ui/file-uploader';

interface TodoListCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TodoListCreateDialog({ isOpen, onClose }: TodoListCreateDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createTodoList, isPending } = useCreateTodoList();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    createTodoList(
      {
        title,
        description,
        coverImageFile: coverImageFile || undefined,
      },
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
          setCoverImageFile(null);
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
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }

      // Store the file for submission
      setCoverImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setCoverImageFile(null);
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
              <FileUploader onFileInputChange={handleImageChange} />
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
