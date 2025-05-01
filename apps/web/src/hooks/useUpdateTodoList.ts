import { API_ENDPOINTS } from '@/lib/config';
import { TodoList } from '@/types/todo-list';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type UpdateTodoListInput = {
  id: string;
  title?: string;
  description?: string;
  theme?: TodoList['theme'];
  displayMode?: TodoList['display_mode'];
  icon?: string | null;
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
  if (input.icon !== undefined) {
    formData.append('icon', input.icon || '');
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

const updateTodoListData = (old: TodoList, updates: UpdateTodoListInput): TodoList => {
  return {
    ...old,
    ...(updates.title && { title: updates.title }),
    ...(updates.description && { description: updates.description }),
    ...(updates.theme && { theme: updates.theme }),
    ...(updates.displayMode && { display_mode: updates.displayMode }),
    ...(updates.icon !== undefined && { icon: updates.icon }),
  };
};

export function useUpdateTodoList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodoList,
    onMutate: async (updatedTodoList) => {
      await queryClient.cancelQueries({ queryKey: ['todoLists'] });
      const previousTodoLists = queryClient.getQueryData<TodoList[]>(['todoLists']) ?? [];

      // Update todoLists query
      queryClient.setQueryData<TodoList[]>(['todoLists', { status: 'active' }], (old = []) => {
        return old.map((list) =>
          list.id === updatedTodoList.id ? updateTodoListData(list, updatedTodoList) : list
        );
      });

      // Update individual todoList query
      const currentTodoList = queryClient.getQueryData<TodoList>(['todoList', updatedTodoList.id]);
      if (currentTodoList) {
        queryClient.setQueryData<TodoList>(
          ['todoList', updatedTodoList.id],
          updateTodoListData(currentTodoList, updatedTodoList)
        );

        // Update custom URL query if exists
        if (currentTodoList.custom_url) {
          queryClient.setQueryData<TodoList>(
            ['todoList', currentTodoList.custom_url],
            updateTodoListData(currentTodoList, updatedTodoList)
          );
        }
      }

      return { previousTodoLists };
    },
    onError: (err, newTodoList, context) => {
      if (context?.previousTodoLists) {
        queryClient.setQueryData(['todoLists'], context.previousTodoLists);
      }
    },
  });
}
