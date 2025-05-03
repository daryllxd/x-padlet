import { TodoGroup } from '@/types/todo-group';
import { TodoItem } from '@x-padlet/types';

export type { TodoGroup, TodoItem };
export interface TodoFormData {
  title: string;
  description: string;
  imageFile?: File | null;
  theme?: TodoItem['theme'] | null;
}
