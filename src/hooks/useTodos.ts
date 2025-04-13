import { supabase } from '@/lib/db';
import { TodoItem } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

async function reorderTodos(todoIds: string[]) {
  const response = await fetch('/api/todos/reorder', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ todo_ids: todoIds }),
  });
  if (!response.ok) {
    throw new Error('Failed to reorder todos');
  }
  return response.json();
}

async function reorderGroupTodos(groupId: string, todo: { id: string; position_in_group: number }) {
  const response = await fetch('/api/todos/reorder', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      group_id: groupId,
      group_todo: todo,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to reorder group todos');
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
    mutationFn: async (
      params: string[] | { groupId: string; todo: { id: string; position_in_group: number } }
    ) => {
      if (Array.isArray(params)) {
        // Handle global reordering
        const { data, error } = await reorderTodos(params);
        if (error) throw error;
        return data as TodoItem[];
      } else {
        const { data, error } = await reorderGroupTodos(params.groupId, params.todo);
        if (error) throw error;
        return data as TodoItem[];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', listId] });
    },
  });

  return {
    todos,
    isLoading,
    toggleTodo: (id: string) => toggleTodoMutation.mutateAsync(id),
    deleteTodo: (id: string) => deleteTodoMutation.mutateAsync(id),
    reorderTodos: (todoIds: string[]) => reorderMutation.mutateAsync(todoIds),
    reorderGroupTodos: (groupId: string, todo: { id: string; position_in_group: number }) =>
      reorderMutation.mutateAsync({ groupId, todo }),
    isToggling: toggleTodoMutation.isPending,
    isDeleting: deleteTodoMutation.isPending,
    isReordering: reorderMutation.isPending,
  };
}
