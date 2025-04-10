import { fetchTodoLists as fetchTodoListsFromApi } from '@/lib/api/todoLists';
import { TodoList } from '@/types/todo';
import { useQuery } from '@tanstack/react-query';

const fetchTodoLists = async (params: {
  id?: string;
  status?: 'active' | 'archived';
}): Promise<TodoList[]> => {
  const baseUrl = `${window.location.origin}/api/todo-lists`;
  return fetchTodoListsFromApi({ ...params, baseUrl });
};

export function useTodoLists({ status }: { status?: 'active' | 'archived' }) {
  return useQuery({
    queryKey: ['todoLists', { status }],
    queryFn: () => fetchTodoLists({ status }),
  });
}

export function useTodoList(id: string) {
  return useQuery({
    queryKey: ['todoLists'],
    queryFn: () => fetchTodoLists({ id }),
    select: (data) => data.find((list) => list.id === id),
    enabled: !!id,
  });
}
