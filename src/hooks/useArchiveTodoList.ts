import { API_ENDPOINTS } from '@/lib/config';
import { TodoList } from '@/types/todo';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const archiveTodoList = async (id: string): Promise<TodoList> => {
  const response = await fetch(`${API_ENDPOINTS.todoList(id)}/archive`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to archive todo list');
  }

  return response.json();
};

export function useArchiveTodoList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveTodoList,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todoLists'] });

      // Snapshot the previous value
      const previousTodoLists = queryClient.getQueryData<TodoList[]>(['todoLists']);

      // Optimistically update to the new value
      queryClient.setQueryData<TodoList[]>(['todoLists'], (old = []) => {
        return old.map((list) => (list.id === id ? { ...list, status: 'archived' } : list));
      });

      return { previousTodoLists };
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTodoLists) {
        queryClient.setQueryData(['todoLists'], context.previousTodoLists);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      queryClient.invalidateQueries({ queryKey: ['todoLists'] });
    },
  });
}
