import { TodoList } from '@/types/todo';
import { useQuery } from '@tanstack/react-query';

const fetchTodoLists = async (): Promise<TodoList[]> => {
  const response = await fetch('http://localhost:3002/api/todo-lists');
  if (!response.ok) {
    throw new Error('Failed to fetch todo lists');
  }
  return response.json();
};

export function useTodoLists() {
  return useQuery({
    queryKey: ['todoLists'],
    queryFn: fetchTodoLists,
  });
}

export function useTodoList(listId: string) {
  return useQuery({
    queryKey: ['todoLists'],
    queryFn: fetchTodoLists,
    select: (data) => data.find((list) => list.id === listId),
    enabled: !!listId,
  });
}
