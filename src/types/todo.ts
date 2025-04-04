export interface TodoList {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  todoCount: number;
}
