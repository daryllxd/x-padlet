export interface TodoList {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  todoCount: number;
  theme: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | null;
  background: 'white' | 'black' | 'gray' | 'blue' | 'green' | 'yellow' | 'purple' | null;
  display_mode: 'masonry' | 'list' | 'grid' | 'kanban' | null;
}

export type TodoListWithCreating = TodoList | (Omit<TodoList, 'status'> & { status: 'creating' });
