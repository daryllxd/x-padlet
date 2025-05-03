import { supabase } from '@/lib/db';
import { TodoItem } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useTodos(listId: string) {
  const queryClient = useQueryClient();

  const {
    data: todos = [],
    isLoading,
    isFetching,
  } = useQuery({
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

  return {
    todos,
    isLoading,
    isFetching,
    toggleTodo: (id: string) => toggleTodoMutation.mutateAsync(id),
    deleteTodo: (id: string) => deleteTodoMutation.mutateAsync(id),
    isToggling: toggleTodoMutation.isPending,
    isDeleting: deleteTodoMutation.isPending,
  };
}
