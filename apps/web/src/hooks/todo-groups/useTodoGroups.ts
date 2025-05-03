import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TodoGroup } from '@x-padlet/types';

export function useTodoGroups(todoListId: string) {
  const queryClient = useQueryClient();

  const {
    data: groups = [],
    isLoading,
    error,
  } = useQuery<TodoGroup[]>({
    queryKey: ['todo-groups', todoListId],
    queryFn: async (): Promise<TodoGroup[]> => {
      const response = await fetch(`/api/todo-lists/${todoListId}/groups`);
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      return response.json();
    },
    retry: 1,
  });

  return {
    groups,
    isLoading,
    error: error as Error | null,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['todo-groups', todoListId] }),
  };
}
