export const THEME_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'white'] as const;

export const TAILWIND_THEME_COLORS = {
  red: 'bg-red-100',
  yellow: 'bg-yellow-100',
  green: 'bg-green-100',
  purple: 'bg-purple-100',
  blue: 'bg-blue-100',
  white: 'bg-white',
} as const;

export const BACKGROUND_COLORS = [
  'white',
  'black',
  'gray',
  'blue',
  'green',
  'yellow',
  'purple',
] as const;
export interface TodoList {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  todoCount: number;
  theme: (typeof THEME_COLORS)[number] | null;
  background: (typeof BACKGROUND_COLORS)[number] | null;
  display_mode: 'masonry' | 'columnar';
}

export type TodoListWithCreating = TodoList | (Omit<TodoList, 'status'> & { status: 'creating' });
