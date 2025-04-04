import { TodoList } from '@/types/todo';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type CreateTodoListInput = {
  title: string;
  description?: string;
};

const createTodoList = async (input: CreateTodoListInput): Promise<TodoList> => {
  // Using JSONPlaceholder as a temporary backend
  const response = await fetch('https://jsonplaceholderss.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to create todo list');
  }

  const data = await response.json();

  // Transform JSONPlaceholder response to match our TodoList type
  return {
    id: data.id.toString(),
    title: data.title,
    description: data.body,
    todoCount: 0,
  };
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
