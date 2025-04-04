import { TodoList } from '@/types/todo';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type CreateTodoListInput = {
  title: string;
  description?: string;
};

const createTodoList = async (input: CreateTodoListInput): Promise<TodoList> => {
  const response = await fetch('http://localhost:3002/api/todo-lists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
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
