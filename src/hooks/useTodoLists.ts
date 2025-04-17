'use client';

import { fetchTodoLists as fetchTodoListsFromApi } from '@/lib/api/todoLists';
import { TodoList } from '@/types/todo-list';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const clientFetchTodoLists = async (
  params: {
    id?: string;
    status?: 'active' | 'archived';
  } = {}
): Promise<TodoList[]> => {
  const baseUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/api/todo-lists` : '/api/todo-lists';
  return fetchTodoListsFromApi({ ...params, baseUrl });
};

export function useTodoLists({ status }: { status?: 'active' | 'archived' }) {
  return useQuery({
    queryKey: ['todoLists', { status }],
    staleTime: 36_000,
    queryFn: () => clientFetchTodoLists({ status }),
  });
}

export function useTodoList(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['todoList', id],
    queryFn: () => clientFetchTodoLists({ id }),
    select: (data) => {
      if (Array.isArray(data)) {
        return data.find((list: TodoList) => list.id === id);
      } else {
        return data;
      }
    },
    enabled: !!id,
    initialData: () => {
      const todoLists = queryClient.getQueryData(['todoLists', { status: 'active' }]);

      if (Array.isArray(todoLists)) {
        return todoLists.find((list: TodoList) => list.id === id);
      }
      return undefined;
    },
  });
}
