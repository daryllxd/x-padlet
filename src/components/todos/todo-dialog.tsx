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
import { TodoItem } from '@/types';
import { Label } from '@radix-ui/react-label';
import { X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useMount } from 'react-use';
import { toast } from 'sonner';
import { FileUploader } from '../ui/file-uploader';
import { Select } from '../ui/select';

interface TodoDialogProps {
  todo?: TodoItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormData) => void;
  mode: 'create' | 'edit';
}

const THEME_COLORS = [
  { value: 'red', label: 'Red', color: 'bg-red-500' },
  { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
  { value: 'green', label: 'Green', color: 'bg-green-500' },
  { value: 'yellow', label: 'Yellow', color: 'bg-yellow-500' },
  { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
] as const;

export function TodoDialog({ todo, open, onOpenChange, onSave, mode }: TodoDialogProps) {
  const [editedTitle, setEditedTitle] = useState(todo?.title || '');
  const [editedDescription, setEditedDescription] = useState<string>(todo?.description || '');
  const [imagePreview, setImagePreview] = useState<string | null>(todo?.image_url || null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTheme, setSelectedTheme] = useState<TodoItem['theme'] | null>(todo?.theme || null);

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
          <DialogTitle>{mode === 'create' ? 'Create Todo' : 'Edit Todo'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Enter title"
              maxLength={255}
            />
          </div>
          <div className="space-y-2">
            <div className="space-y-2">
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
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <LexicalEditor
              initialContent={editedDescription}
              onChange={handleEditorChange}
              className="min-h-[200px] rounded-md border p-4"
            />
          </div>
          <div className="space-y-2">
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
