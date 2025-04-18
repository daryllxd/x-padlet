import { API_ENDPOINTS } from '@/lib/config';
import { TodoList } from '@/types/todo-list';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type UpdateTodoListInput = {
  id: string;
  title?: string;
  description?: string;
  theme?: TodoList['theme'];
  displayMode?: TodoList['display_mode'];
};

const updateTodoList = async (input: UpdateTodoListInput): Promise<TodoList> => {
  const formData = new FormData();

  if (input.title) {
    formData.append('title', input.title);
  }
  if (input.description) {
    formData.append('description', input.description);
  }
  if (input.theme) {
    formData.append('theme', input.theme);
  }
  if (input.displayMode) {
    formData.append('display_mode', input.displayMode);
  }
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

      queryClient.setQueryData<TodoList[]>(['todoLists', { status: 'active' }], (old = []) => {
        return old.map((list) =>
          list.id === updatedTodoList.id
            ? {
                ...list,
                ...(updatedTodoList.title && { title: updatedTodoList.title }),
                ...(updatedTodoList.description && { description: updatedTodoList.description }),
                ...(updatedTodoList.theme && { theme: updatedTodoList.theme }),
                ...(updatedTodoList.displayMode && { display_mode: updatedTodoList.displayMode }),
              }
            : list
        );
      });

      queryClient.setQueryData<TodoList>(['todoList', updatedTodoList.id], (old) => {
        if (!old) {
          return undefined;
        }

        return {
          ...old,
          ...(updatedTodoList.title && { title: updatedTodoList.title }),
          ...(updatedTodoList.description && { description: updatedTodoList.description }),
          ...(updatedTodoList.theme && { theme: updatedTodoList.theme }),
          ...(updatedTodoList.displayMode && { display_mode: updatedTodoList.displayMode }),
        };
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
