import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// API functions
async function fetchTodos(listId?: string) {
  const url = listId ? `/api/todos?todo_list_id=${listId}` : '/api/todos';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
}

type CreateTodoInput = {
  title: string;
  description?: string;
  todo_list_id: string;
};

async function createTodo(input: FormData | CreateTodoInput) {
  let formData: FormData;

  if (input instanceof FormData) {
    formData = input;
  } else {
    formData = new FormData();
    formData.append('title', input.title);
    if (input.description) {
      formData.append('description', input.description);
    }
    formData.append('todo_list_id', input.todo_list_id);
  }

  const response = await fetch('/api/todos', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  return response.json();
}

async function updateTodo(id: string, formData: FormData) {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to update todo');
  }
  return response.json();
}

async function toggleTodo(id: string) {
  const response = await fetch(`/api/todos/${id}/toggle`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    throw new Error('Failed to toggle todo');
  }
  return response.json();
}

async function deleteTodo(id: string) {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
  return response.json();
}

async function reorderTodos(todoIds: string[]) {
  const formData = new FormData();
  formData.append('todo_ids', JSON.stringify(todoIds));

  const response = await fetch('/api/todos/reorder', {
    method: 'PATCH',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to reorder todos');
  }
  return response.json();
}

export function useTodos(listId?: string) {
  const queryClient = useQueryClient();

  // Queries
  const todosQuery = useQuery({
    queryKey: ['todos', listId],
    queryFn: () => fetchTodos(listId),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', listId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => updateTodo(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', listId] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', listId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', listId] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderTodos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', listId] });
    },
  });

  return {
    // Data and loading states
    todos: todosQuery.data ?? [],
    isLoading: todosQuery.isLoading,
    isError: todosQuery.isError,
    error: todosQuery.error,

    // Mutations
    fetchTodos: (listId?: string) => fetchTodos(listId),
    addTodo: (input: FormData | CreateTodoInput) => createMutation.mutate(input),
    updateTodo: (id: string, formData: FormData) => updateMutation.mutate({ id, formData }),
    toggleTodo: (id: string) => toggleMutation.mutate(id),
    deleteTodo: (id: string) => deleteMutation.mutate(id),
    reorderTodos: (todoIds: string[]) => reorderMutation.mutate(todoIds),

    // Mutation states
    isAdding: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: reorderMutation.isPending,
  };
}
