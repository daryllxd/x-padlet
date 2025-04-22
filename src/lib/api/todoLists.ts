import { TodoList } from '@/types/todo-list';

export async function fetchTodoLists({
  status,
  baseUrl,
}: {
  status?: 'active' | 'archived';
  baseUrl: string;
  id?: string;
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

export async function fetchTodoList({
  id,
  baseUrl,
}: {
  baseUrl?: string;
  id: string;
}): Promise<TodoList> {
  try {
    const response = await fetch(`${baseUrl}`, {
      next: { revalidate: 10, tags: ['todo-list', id] },
    });

    if (!response.ok) {
      console.error('Fetch failed with status:', response.status);
      throw new Error('Failed to fetch todo list');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchTodoList:', error);
    throw error;
  }
}
