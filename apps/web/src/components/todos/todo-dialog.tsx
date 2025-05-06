import { LexicalEditor } from '@/components/markdown/lexical-editor';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { TodoItem } from '@x-padlet/types';
import { X } from 'lucide-react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useMount } from 'react-use';
import { toast } from 'sonner';
import { FileUploader } from '../ui/file-uploader';
import { Select } from '../ui/select';
import { WebcamCapture } from '../ui/webcam-capture/webcam-capture';

type Nullable<T> = T | null;

interface TodoDialogProps {
  todo: Nullable<TodoItem>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormData) => void;
  mode: 'create' | 'edit';
}

export interface TodoDialogRef {
  resetForm: () => void;
}

const THEME_COLORS: { value: NonNullable<TodoItem['theme']>; label: string; color: string }[] = [
  { value: 'red', label: 'Red', color: 'bg-red-500' },
  { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
  { value: 'green', label: 'Green', color: 'bg-green-500' },
  { value: 'yellow', label: 'Yellow', color: 'bg-yellow-500' },
  { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
  { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
] as const;

export const TodoDialog = forwardRef<TodoDialogRef, TodoDialogProps>(
  ({ todo, open, onOpenChange, onSave, mode }, ref) => {
    const [editedTitle, setEditedTitle] = useState(todo?.title || '');
    const [editedDescription, setEditedDescription] = useState<string>(todo?.description || '');
    const [imagePreview, setImagePreview] = useState<string | null>(todo?.image_url || null);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedTheme, setSelectedTheme] = useState<TodoItem['theme'] | null>(
      todo?.theme || null
    );

    useImperativeHandle(ref, () => ({
      resetForm: () => {
        setEditedTitle('');
        setEditedDescription('');
        setSelectedTheme(null);
        setCoverImageFile(null);
        setImagePreview(null);
      },
    }));

    useMount(() => {
      if (todo?.image_url) {
        setImagePreview(todo.image_url);
      }
    });

    const handleSave = () => {
      const formData = new FormData();
      formData.append('title', editedTitle);
      formData.append('description', editedDescription);
      if (coverImageFile) {
        formData.append('image', coverImageFile);
      } else if (todo?.image_url && !imagePreview) {
        // If there was an image and it's been removed
        formData.append('remove_image', 'true');
      }
      if (selectedTheme) {
        formData.append('theme', selectedTheme);
      }
      onSave(formData);
      onOpenChange(false);
    };

    const handleEditorChange = (content: string) => {
      setEditedDescription(content);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            if (file.size > 5 * 1024 * 1024) {
              toast.error('Image size should be less than 5MB');
              return;
            }

            setCoverImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
              setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
        }
      }
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

    const handleImageCapture = (imageData: string) => {
      setImagePreview(imageData);
      // Convert base64 to File object
      fetch(imageData)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
          setCoverImageFile(file);
        });
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
        <DialogContent onPaste={handlePaste}>
          <DialogHeader>
            <DialogTitle className="pb-4 text-left">
              <label htmlFor="title" className="sr-only">
                Title
              </label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Enter title"
                maxLength={255}
                className="rounded-none border-0 border-b border-dashed py-0 text-lg focus-visible:ring-0 lg:text-lg"
              />
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pb-4">
            <div className="space-y-2">
              <label htmlFor="description" className="sr-only">
                Description
              </label>
              <div className="group">
                <LexicalEditor
                  initialContent={editedDescription}
                  onChange={handleEditorChange}
                  className="min-h-[200px] rounded-md border border-dashed p-4 group-focus-within:border-gray-700"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col gap-1">
                <Label>Image (optional)</Label>
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
                      className="absolute right-2 top-2 rounded-full bg-white/80 p-1 hover:bg-white"
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <FileUploader onFileInputChange={handleImageChange} />
                    <div className="flex items-center justify-center">
                      <span className="text-sm text-gray-500">or</span>
                    </div>
                    <WebcamCapture onCapture={handleImageCapture} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Theme Color</Label>
              <Select
                items={[{ value: 'none', label: 'None' }, ...THEME_COLORS]}
                value={selectedTheme || 'none'}
                onChange={(value) => {
                  setSelectedTheme(value === 'none' ? null : (value as TodoItem['theme']));
                }}
                placeholder="Select a theme"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{mode === 'create' ? 'Create' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
