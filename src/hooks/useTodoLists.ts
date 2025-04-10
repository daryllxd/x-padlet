'use client';

import { fetchTodoLists as fetchTodoListsFromApi } from '@/lib/api/todoLists';
import { TodoList } from '@/types/todo';
import { useQuery } from '@tanstack/react-query';

const clientFetchTodoLists = async (params: {
  id?: string;
  status?: 'active' | 'archived';
}): Promise<TodoList[]> => {
  const baseUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/api/todo-lists` : '/api/todo-lists';
  return fetchTodoListsFromApi({ ...params, baseUrl });
};

export function useTodoLists({ status }: { status?: 'active' | 'archived' }) {
  return useQuery({
    queryKey: ['todoLists', { status }],
    queryFn: () => clientFetchTodoLists({ status }),
  });
}

export function useTodoList(id: string) {
  return useQuery({
    queryKey: ['todoLists'],
    queryFn: () => clientFetchTodoLists({ id }),
    select: (data) => data.find((list) => list.id === id),
    enabled: !!id,
  });
}
