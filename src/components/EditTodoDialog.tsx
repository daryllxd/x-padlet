import { TodoItem } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LexicalEditor } from "@/components/LexicalEditor";

interface EditTodoDialogProps {
  todo: TodoItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: { title: string; description: string }) => void;
}

export function EditTodoDialog({
  todo,
  open,
  onOpenChange,
  onSave,
}: EditTodoDialogProps) {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState<string>(
    todo.description || ""
  );

  const handleSave = () => {
    onSave({
      title: editedTitle,
      description: editedDescription,
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
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <LexicalEditor
              initialContent={editedDescription}
              onChange={handleEditorChange}
              className="min-h-[200px] border rounded-md p-4"
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
