import { TodoGroup } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
  });

  const createGroupMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch(`/api/todo-lists/${todoListId}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo-groups', todoListId] });
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: async ({ groupId, name }: { groupId: string; name: string }) => {
      const response = await fetch(`/api/todo-lists/${todoListId}/groups/${groupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to update group');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo-groups', todoListId] });
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const response = await fetch(`/api/todo-lists/${todoListId}/groups/${groupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete group');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo-groups', todoListId] });
    },
  });

  const reorderGroupsMutation = useMutation({
    mutationFn: async (groupIds: string[]) => {
      const formData = new FormData();
      formData.append('todo_group_ids', JSON.stringify(groupIds));

      const response = await fetch('/api/todo-groups/reorder', {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to reorder groups');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo-groups', todoListId] });
    },
  });

  return {
    groups,
    isLoading,
    error: error as Error | null,
    createGroupMutation,
    updateGroup: updateGroupMutation.mutate,
    deleteGroupMutation,
    reorderGroups: reorderGroupsMutation.mutateAsync,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['todo-groups', todoListId] }),
  };
}
