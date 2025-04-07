import { TodoList } from '@/types/todo';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type CreateTodoListInput = {
  title: string;
  description?: string;
  coverImageFile?: File;
};

const createTodoList = async (input: CreateTodoListInput): Promise<TodoList> => {
  // Create FormData to handle file upload
  const formData = new FormData();
  formData.append('title', input.title);

  if (input.description) {
    formData.append('description', input.description);
  }

  if (input.coverImageFile) {
    formData.append('coverImage', input.coverImageFile);
  }

  const response = await fetch('http://localhost:3002/api/todo-lists', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create todo list');
  }

  return response.json();
};

export function useCreateTodoList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodoList,
    onMutate: async (newTodoList) => {
      await queryClient.cancelQueries({ queryKey: ['todoLists'] });
      const previousTodoLists = queryClient.getQueryData<TodoList[]>(['todoLists']) ?? [];

      const optimisticTodoList: TodoList = {
        id: `temp-${Date.now()}`,
        title: newTodoList.title,
        description: newTodoList.description,
        todoCount: 0,
        status: 'active',
        // We don't include coverImage in the optimistic update since it's a file
        // and will be handled by the server
      };

      queryClient.setQueryData<TodoList[]>(['todoLists'], (old = []) => {
        return [...old, optimisticTodoList];
      });

      return { previousTodoLists };
    },
    onError: (err, newTodoList, context) => {
      if (context?.previousTodoLists) {
        queryClient.setQueryData(['todoLists'], context.previousTodoLists);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todoLists'] });
    },
  });
}
