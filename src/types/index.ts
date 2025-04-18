import { TodoItem } from '@/types/todo';
import { TodoGroup } from '@/types/todo-group';

export type { TodoGroup, TodoItem };
export interface TodoFormData {
  title: string;
  description: string;
  imageFile?: File | null;
  theme?: TodoItem['theme'] | null;
}
