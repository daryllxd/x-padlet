import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useTodoGroups(todoListId: string) {
  const queryClient = useQueryClient();

  const {
    data: groups = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['todo-groups', todoListId],
    queryFn: async () => {
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
    deleteGroup: deleteGroupMutation.mutate,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['todo-groups', todoListId] }),
  };
}
