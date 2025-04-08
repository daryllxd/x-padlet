'use client';

import { useTodoLists } from '@/hooks/useTodoLists';
import { TodoList } from '@/types/todo';
import { TodoListCard } from './todo-list-card';

export function TodoListGrid() {
  const { data } = useTodoLists();

  if (!data || data.length === 0) {
    return (
      <div className="mt-12 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
        <h3 className="text-xl font-medium text-slate-900">No todo lists yet</h3>
        <p className="mt-2 text-slate-500">Create your first todo list to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((list: TodoList) => (
        <TodoListCard
          key={list.id}
          id={list.id}
          title={list.title}
          description={list.description}
          todoCount={list.todoCount}
        />
      ))}
    </div>
  );
}
