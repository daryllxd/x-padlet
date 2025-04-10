import { supabase } from '@/lib/db';
import { TodoItem } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export function useTodos(listId: string) {
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos', listId],
    queryFn: async () => {
      const response = await fetch(`/api/todos?todo_list_id=${listId}`);

      return response.json();
    },
  });

  const addTodoMutation = useMutation({
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

  const toggleTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const todo = todos.find((t: TodoItem) => t.id === id);
      if (!todo) throw new Error('Todo not found');

      const { data, error } = await supabase
        .from('todos')
        .update({ is_completed: !todo.is_completed })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as TodoItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', listId] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('todos').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', listId] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (todoIds: string[]) => {
      const { data, error } = await reorderTodos(todoIds);
      if (error) throw error;
      return data as TodoItem[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', listId] });
    },
  });

  return {
    todos,
    isLoading,
    addTodo: (formData: FormData) => addTodoMutation.mutateAsync(formData),
    updateTodo: (id: string, formData: FormData) => updateMutation.mutateAsync({ id, formData }),
    toggleTodo: (id: string) => toggleTodoMutation.mutateAsync(id),
    deleteTodo: (id: string) => deleteTodoMutation.mutateAsync(id),
    reorderTodos: (todoIds: string[]) => reorderMutation.mutateAsync(todoIds),
    isAdding: addTodoMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleTodoMutation.isPending,
    isDeleting: deleteTodoMutation.isPending,
    isReordering: reorderMutation.isPending,
  };
}
