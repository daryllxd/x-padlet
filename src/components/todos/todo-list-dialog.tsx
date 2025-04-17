'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TodoList } from '@/types/todo-list';
import { LoaderIcon, X } from 'lucide-react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';
import { FileUploader } from '../ui/file-uploader';

type Nullable<T> = T | null;

interface TodoListDialogProps {
  todoList: Nullable<TodoList>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormData) => void;
  mode: 'create' | 'edit';
  isSaving?: boolean;
}

export interface TodoListDialogRef {
  clearForm: () => void;
}

export const TodoListDialog = forwardRef<TodoListDialogRef, TodoListDialogProps>(
  ({ todoList, open, onOpenChange, onSave, isSaving, mode }, ref) => {
    const [title, setTitle] = useState(todoList?.title || '');
    const [description, setDescription] = useState(todoList?.description || '');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      clearForm: () => {
        setTitle('');
        setDescription('');
        setImagePreview(null);
        setCoverImageFile(null);
      },
    }));

    const handleSave = () => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (coverImageFile) {
        formData.append('cover_image', coverImageFile);
      }
      onSave(formData);
      onOpenChange(false);
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

        setCoverImageFile(file);

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
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Create Todo List' : 'Edit Todo List'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground rounded-md px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
            >
              {mode === 'create' ? 'Create' : 'Save'}
              {isSaving && <LoaderIcon className="ml-2 h-4 w-4" />}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
