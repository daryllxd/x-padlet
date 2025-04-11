import { useCreateTodoList } from '@/hooks/useCreateTodoList';
import { useRef } from 'react';
import { toast } from 'sonner';
import { TodoListDialog, TodoListDialogRef } from './todo-list-dialog';

interface TodoListCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TodoListCreateDialog({ isOpen, onClose }: TodoListCreateDialogProps) {
  const dialogRef = useRef<TodoListDialogRef>(null);
  const { mutate: createTodoList, isPending } = useCreateTodoList();

  const handleSave = (formData: FormData) => {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const coverImageFile = formData.get('cover_image') as File | null;

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
          onClose();
        },
        onError: (error) => {
          toast.error('Failed to create todo list. Please try again.');
        },
      }
    );
  };

  return (
    <TodoListDialog
      ref={dialogRef}
      todoList={null}
      open={isOpen}
      onOpenChange={onClose}
      onSave={handleSave}
      isSaving={isPending}
      mode="create"
    />
  );
}
