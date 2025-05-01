import { TodoItem } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function reorderTodos(todoIds: string[]) {
  const response = await fetch('/api/todos/reorder', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ todo_ids: todoIds }),
  });
  if (!response.ok) {
    throw new Error('Failed to reorder todos');
  }
  return response.json();
}

async function reorderGroupTodos(groupId: string, todo: { id: string; position_in_group: number }) {
  const response = await fetch('/api/todos/reorder', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      group_id: groupId,
      group_todo: todo,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to reorder group todos');
  }
  return response.json();
}

export function useReorderTodo(listId: string) {
  const queryClient = useQueryClient();

  const reorderMutation = useMutation({
    mutationFn: async (
      params: string[] | { groupId: string; todo: { id: string; position_in_group: number } }
    ) => {
      if (Array.isArray(params)) {
        // Handle global reordering
        const { data, error } = await reorderTodos(params);
        if (error) throw error;
        return data as TodoItem[];
      } else {
        const { data, error } = await reorderGroupTodos(params.groupId, params.todo);
        if (error) throw error;
        return data as TodoItem[];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', listId] });
    },
  });

  return {
    reorderTodos: (todoIds: string[]) => reorderMutation.mutateAsync(todoIds),
    reorderGroupTodos: (groupId: string, todo: { id: string; position_in_group: number }) =>
      reorderMutation.mutateAsync({ groupId, todo }),

    isReordering: reorderMutation.isPending,
  };
}
