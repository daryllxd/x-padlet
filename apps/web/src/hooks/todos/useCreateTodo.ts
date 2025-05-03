import { TodoItem } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoList } from '@x-padlet/types';

interface CreateTodoParams {
  listId: string;
}

export function useCreateTodo({ listId }: CreateTodoParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`/api/todos`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      return response.json();
    },
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos', listId] });
      const previousTodos = queryClient.getQueryData<TodoItem[]>(['todos', listId]) ?? [];

      const optimisticTodo: TodoItem = {
        id: 'temp-id',
        title: newTodo.get('title')?.toString() ?? '',
        description: newTodo.get('description')?.toString() ?? '',
        todo_list_id: listId,
        todo_group_id: newTodo.get('todo_group_id')?.toString() ?? '',
        todo_group_name: '',
        todo_group_position: 0,
        is_completed: false,
        position: 1,
        position_in_group: 1,
        theme: (newTodo.get('theme')?.toString() ?? 'blue') as TodoItem['theme'],
        image_url: newTodo.get('image')?.toString() ? '/loading-image.png' : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData<TodoItem[]>(['todos', listId], (old = []) => {
        return [optimisticTodo, ...old];
      });

      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos', listId], context.previousTodos);
      }
    },
    onSettled: () => {
      const todoList = queryClient.getQueryData<TodoList>(['todoList', listId]);
      const customUrl = todoList?.custom_url;

      queryClient.invalidateQueries({ queryKey: ['todos', listId] });
      if (customUrl) {
        queryClient.invalidateQueries({ queryKey: ['todos', customUrl] });
      }
    },
  });
}
