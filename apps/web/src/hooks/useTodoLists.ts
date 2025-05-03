'use client';

import { fetchTodoLists as fetchTodoListsFromApi } from '@/lib/api/todoLists';
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { TodoList } from '@x-padlet/types';

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

export function useTodoList(id: string): UseQueryResult<TodoList, Error> {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['todoList', id],
    queryFn: async () => {
      const response = await fetch(`/api/todo-lists/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch todo list');
      }
      return response.json();
    },
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
