import { socketEvents } from '@/lib/socket';
import { TodoItem } from '@/types';
import { useQuery } from '@tanstack/react-query';

const fetchTodos = async (listId: string): Promise<TodoItem[]> => {
  const response = await fetch(`http://localhost:3002/api/todos?listId=${listId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
};

export function useTodos(listId: string) {
  return {
    ...useQuery({
      queryKey: ['todos', listId],
      queryFn: () => fetchTodos(listId),
    }),
    // Actions that emit socket events
    addTodo: (todo: Omit<TodoItem, 'id' | 'created_at' | 'updated_at' | 'position'>) => {
      socketEvents.createTodo({ ...todo, todo_list_id: listId });
    },
    updateTodo: (id: string, updates: Partial<TodoItem>) => {
      socketEvents.updateTodo({ id, ...updates, todo_list_id: listId });
    },
    deleteTodo: (id: string) => {
      socketEvents.deleteTodo(id);
    },
    toggleComplete: (id: string) => {
      socketEvents.toggleTodo(id);
    },
  };
}
