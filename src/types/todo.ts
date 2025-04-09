export interface TodoList {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  todoCount: number;
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  position: number;
  todo_list_id: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}
