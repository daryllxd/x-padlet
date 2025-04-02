export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}
