import { TodoList } from '@/types';

export async function fetchTodoLists({
  status,
  baseUrl,
}: {
  status?: 'active' | 'archived';
  baseUrl: string;
}): Promise<TodoList[]> {
  const params = new URLSearchParams();
  if (status) {
    params.append('status', status);
  }

  const fullUrl = `${baseUrl}${params.toString() ? '?' + params.toString() : ''}`;

  try {
    const response = await fetch(fullUrl, {
      next: { revalidate: 60, tags: ['todo-lists'] },
    });

    if (!response.ok) {
      console.error('Fetch failed with status:', response.status);
      throw new Error('Failed to fetch todo lists');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchTodoLists:', error);
    throw error;
  }
}
