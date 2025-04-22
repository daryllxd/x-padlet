'use client';

import { TodoItem } from '@/types';
import { TodoCard } from './todo-card';

interface StreamTodoListProps {
  todos: TodoItem[];
  listId: string;
}

export function StreamTodoList({ todos, listId }: StreamTodoListProps) {
  return (
    <div className="mx-auto flex flex-col gap-4 lg:w-[600px]">
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} listId={listId} />
      ))}
    </div>
  );
}
