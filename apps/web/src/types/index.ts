import { TodoItem } from '@x-padlet/types';
export interface TodoFormData {
  title: string;
  description: string;
  imageFile?: File | null;
  theme?: TodoItem['theme'] | null;
}
