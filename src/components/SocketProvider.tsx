'use client';

import { socketEvents } from '@/lib/socket';
import { TodoItem } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Handle todo creation
    socketEvents.onTodoCreated((todo: TodoItem) => {
      queryClient.setQueryData(['todos', todo.todo_list_id], (old: TodoItem[] = []) => [
        ...old,
        todo,
      ]);
    });

    // Handle todo updates
    socketEvents.onTodoUpdated((updatedTodo: TodoItem) => {
      queryClient.setQueryData(['todos', updatedTodo.todo_list_id], (old: TodoItem[] = []) =>
        old.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
    });

    // Handle todo deletion
    socketEvents.onTodoDeleted((todoId: string) => {
      // Since we don't know the list ID from the event, we need to update all todo lists
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    });

    // Handle todo toggle
    socketEvents.onTodoToggled((todoId: string, completed: boolean) => {
      // Update all todo lists since we don't have the list ID
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    });

    // Handle todo reordering
    socketEvents.onTodoReordered((todos: TodoItem[]) => {
      if (todos.length > 0) {
        const listId = todos[0].todo_list_id;
        queryClient.setQueryData(
          ['todos', listId],
          todos.sort((a, b) => a.position - b.position)
        );
      }
    });

    // No need for cleanup as the provider lives for the entire app lifecycle
  }, [queryClient]);

  return children;
}
