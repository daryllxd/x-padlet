'use client';

import { TodoList } from '@/types/todo-list';
import { useRef } from 'react';
import { TodoListDialog, TodoListDialogRef } from './todo-list-dialog';

interface TodoListEditDialogProps {
  todoList: Pick<TodoList, 'id' | 'title' | 'description'>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormData) => void;
}

export function TodoListEditDialog({
  todoList,
  open,
  onOpenChange,
  onSave,
}: TodoListEditDialogProps) {
  const dialogRef = useRef<TodoListDialogRef>(null);

  return (
    <TodoListDialog
      ref={dialogRef}
      todoList={todoList}
      open={open}
      onOpenChange={onOpenChange}
      onSave={onSave}
      mode="edit"
    />
  );
}
