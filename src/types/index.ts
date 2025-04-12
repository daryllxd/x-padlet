import { TodoItem, TodoList } from '@/types/todo';

export type { TodoItem, TodoList };
export interface TodoFormData {
  title: string;
  description: string;
  imageFile?: File | null;
  theme?: TodoItem['theme'] | null;
}
