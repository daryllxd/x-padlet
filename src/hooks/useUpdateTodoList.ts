import { API_ENDPOINTS } from '@/lib/config';
import { TodoList, TodoListWithCreating } from '@/types/todo';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type UpdateTodoListInput = {
  id: string;
  title: string;
  description: string;
};

const updateTodoList = async (input: UpdateTodoListInput): Promise<TodoList> => {
  const formData = new FormData();
  formData.append('title', input.title);
  formData.append('description', input.description);
  const response = await fetch(API_ENDPOINTS.todoList(input.id), {
    method: 'PATCH',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update todo list');
  }

  return response.json();
};

export function useUpdateTodoList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodoList,
    onMutate: async (updatedTodoList) => {
      await queryClient.cancelQueries({ queryKey: ['todoLists'] });
      const previousTodoLists = queryClient.getQueryData<TodoList[]>(['todoLists']) ?? [];

      queryClient.setQueryData<TodoListWithCreating[]>(['todoLists'], (old = []) => {
        return old.map((list) =>
          list.id === updatedTodoList.id ? { ...list, title: updatedTodoList.title } : list
        );
      });

      return { previousTodoLists };
    },
    onError: (err, newTodoList, context) => {
      if (context?.previousTodoLists) {
        queryClient.setQueryData(['todoLists'], context.previousTodoLists);
      }
    },
  });
}
