import { TodoItem } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateTodoParams {
  listId: string;
}

export function useUpdateTodo({ listId }: UpdateTodoParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      formData.append('todo_list_id', listId);
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      return response.json();
    },
    onMutate: async ({ id, formData }) => {
      await queryClient.cancelQueries({ queryKey: ['todos', listId] });
      const previousTodos = queryClient.getQueryData<TodoItem[]>(['todos', listId]) ?? [];

      // Create optimistic todo with a placeholder image
      const optimisticTodo: TodoItem = {
        ...previousTodos.find((todo) => todo.id === id)!,
        title: formData.get('title')?.toString() ?? '',
        theme: (formData.get('theme')?.toString() ?? 'blue') as TodoItem['theme'],
        updated_at: new Date().toISOString(),
        image_url: '/loading-image.png',
      };

      // Update the cache
      queryClient.setQueryData<TodoItem[]>(['todos', listId], (old = []) => {
        return old.map((todo) => (todo.id === id ? optimisticTodo : todo));
      });

      return { previousTodos };
    },
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos', listId], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', listId] });
    },
  });
}
