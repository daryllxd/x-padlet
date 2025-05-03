import { cn } from '@/lib/utils';
import { TodoItem } from '@/types';

export function getTodoThemeStyles(
  theme: TodoItem['theme'],
  contextMenuOpen = false
): ReturnType<typeof cn> {
  return cn(
    theme === 'blue' && [
      'bg-blue-200 transition-colors hover:bg-blue-300',
      contextMenuOpen && 'bg-blue-300',
    ],
    theme === 'green' && [
      'bg-green-200 transition-colors hover:bg-green-300',
      contextMenuOpen && 'bg-green-300',
    ],
    theme === 'yellow' && [
      'bg-yellow-200 transition-colors hover:bg-yellow-300',
      contextMenuOpen && 'bg-yellow-300',
    ],
    theme === 'purple' && [
      'bg-purple-200 transition-colors hover:bg-purple-300',
      contextMenuOpen && 'bg-purple-300',
    ],
    theme === 'red' && [
      'bg-red-200 transition-colors hover:bg-red-300',
      contextMenuOpen && 'bg-red-300',
    ],
    theme === 'orange' && [
      'bg-orange-200 transition-colors hover:bg-orange-300',
      contextMenuOpen && 'bg-orange-300',
    ],
    !theme && 'bg-slate-100 transition-colors hover:bg-slate-300'
  );
}

export function getTodoHoverClasses(theme: TodoItem['theme']): ReturnType<typeof cn> {
  return cn(
    theme === 'blue' && `hover:bg-blue-100`,
    theme === 'green' && `hover:bg-green-100`,
    theme === 'yellow' && `hover:bg-yellow-100`,
    theme === 'purple' && `hover:bg-purple-100`,
    theme === 'red' && `hover:bg-red-100`,
    theme === 'orange' && `hover:bg-orange-100`,
    !theme && `hover:bg-slate-100`
  );
}
