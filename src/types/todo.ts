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
  theme: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | null;
  todo_group_id: string;
  todo_group_name: string;
  todo_group_position: number;
  position_in_group: number;
}
