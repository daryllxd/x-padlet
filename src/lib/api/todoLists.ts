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
  const params = new URLSearchParams();
  params.append('id', id);

  const fullUrl = `${baseUrl}${params.toString() ? '?' + params.toString() : ''}`;

  console.log('fullUrl', fullUrl);
  console.log('id', id);

  try {
    const response = await fetch(fullUrl, {
      next: { revalidate: 10, tags: ['todo-list', id] },
    });

    if (!response.ok) {
      console.error('Fetch failed with status:', response.status);
      throw new Error('Failed to fetch todo lists');
    }

    const data = await response.json();

    return data.find((list: TodoList) => list.id === id);
  } catch (error) {
    console.error('Error in fetchTodoLists:', error);
    throw error;
  }
}
