export const THEME_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'white'] as const;

/**
 * @description This cannot be interpolated because the Tailwind container class is not a string literal.
 * This is a workaround to get the type safety of the theme color.
 */
export const TAILWIND_THEME_COLORS = {
  red: 'bg-red-100',
  yellow: 'bg-yellow-100',
  green: 'bg-green-100',
  purple: 'bg-purple-100',
  blue: 'bg-blue-100',
  white: 'bg-white',
} as const;

export type ThemeColor = (typeof THEME_COLORS)[number];
export type TailwindThemeColor = (typeof TAILWIND_THEME_COLORS)[keyof typeof TAILWIND_THEME_COLORS];
export interface TodoList {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  todoCount: number;
  theme: ThemeColor | null;
  background: ThemeColor | null;
  display_mode: 'masonry' | 'columnar' | 'stream';
}

export type TodoListWithCreating = TodoList | (Omit<TodoList, 'status'> & { status: 'creating' });
