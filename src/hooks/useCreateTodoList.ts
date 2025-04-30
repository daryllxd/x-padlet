import { API_ENDPOINTS } from '@/lib/config';
import { TodoList } from '@/types/todo-list';
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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['todoLists'] });
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
