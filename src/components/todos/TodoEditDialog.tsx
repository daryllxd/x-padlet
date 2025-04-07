import { LexicalEditor } from '@/components/markdown/LexicalEditor';
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
import { useState } from 'react';

interface TodoEditDialogProps {
  todo: TodoItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: { title: string; description: string; image_url?: string | null }) => void;
}

export function TodoEditDialog({ todo, open, onOpenChange, onSave }: TodoEditDialogProps) {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState<string>(todo.description || '');
  const [editedImageUrl, setEditedImageUrl] = useState(todo.image_url || '');

  const handleSave = () => {
    onSave({
      title: editedTitle,
      description: editedDescription,
      image_url: editedImageUrl || null,
    });
    onOpenChange(false);
  };

  const handleEditorChange = (content: string) => {
    setEditedDescription(content);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
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
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Image URL
            </label>
            <Input
              id="imageUrl"
              value={editedImageUrl}
              onChange={(e) => setEditedImageUrl(e.target.value)}
              placeholder="Enter image URL"
            />
            {editedImageUrl && (
              <img
                src={editedImageUrl}
                alt="Preview"
                className="mt-2 h-32 w-full rounded-md object-cover"
                onError={() => setEditedImageUrl('')}
              />
            )}
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
