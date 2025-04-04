import { TodoList } from '@/types/todo';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const archiveTodoList = async (id: string): Promise<void> => {
  const response = await fetch(`http://localhost:3002/api/todo-lists/${id}/archive`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to archive todo list');
  }
};

export function useArchiveTodoList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveTodoList,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todoLists'] });
      const previousTodoLists = queryClient.getQueryData<TodoList[]>(['todoLists']) ?? [];

      // Optimistically remove the list from the cache
      queryClient.setQueryData<TodoList[]>(['todoLists'], (old = []) => {
        return old.filter((list) => list.id !== id);
      });

      return { previousTodoLists };
    },
    onError: (err, id, context) => {
      if (context?.previousTodoLists) {
        queryClient.setQueryData(['todoLists'], context.previousTodoLists);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todoLists'] });
    },
  });
}
