import { API_ENDPOINTS } from '@/lib/config';
import { TodoList } from '@/types/todo';

export async function fetchTodoLists(): Promise<TodoList[]> {
  const response = await fetch(API_ENDPOINTS.todoLists, {
    // Add next: { revalidate: 0 } to disable cache or adjust as needed
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch todo lists');
  }

  return response.json();
}
