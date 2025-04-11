import { API_ENDPOINTS } from '@/lib/config';
import { TodoList, TodoListWithCreating } from '@/types/todo';
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
    formData.append('cover_image', input.coverImageFile);
  }

  const response = await fetch(API_ENDPOINTS.todoLists, {
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

      const optimisticTodoList: TodoListWithCreating = {
        id: 'temp-id',
        title: newTodoList.title,
        description: newTodoList.description,
        status: 'creating',
        todoCount: 0,
      };

      queryClient.setQueryData<TodoListWithCreating[]>(
        ['todoLists', { status: 'active' }],
        (old = []) => {
          return [optimisticTodoList, ...old];
        }
      );

      return { previousTodoLists };
    },
    onError: (err, newTodoList, context) => {
      if (context?.previousTodoLists) {
        queryClient.setQueryData(['todoLists'], context.previousTodoLists);
      }
    },
    onSettled: () => {
      // Get all query keys that start with 'todoLists'
      const todoListQueries = queryClient.getQueriesData({ queryKey: ['todoLists'] });

      // Invalidate all todoList queries
      todoListQueries.forEach(([queryKey]) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
  });
}
