'use client';

import { useTodoLists } from '@/hooks/useTodoLists';
import { TodoList } from '@/types/todo-list';
import { CreateTodoListButton } from '../todo-lists/create-todo-list-button';
import { TodoListCard } from '../todo-lists/todo-list-card';
import { TodoListSkeleton } from '../todo-lists/todo-list-skeleton';

export function TodoListGrid() {
  const { data, isPending, error } = useTodoLists({ status: 'active' });

  if (isPending && !data) {
    return <TodoListSkeleton />;
  }

  if (error) {
    return (
      <div className="mt-12 rounded-xl border-2 border-dashed border-red-200 bg-red-50 p-12 text-center">
        <h3 className="text-xl font-medium text-red-900">Error loading todo lists</h3>
        <p className="mt-2 text-red-500">Please try again later</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mt-12 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
        <h3 className="text-xl font-medium text-slate-900">No todo lists yet</h3>
        <p className="mt-2 text-slate-500">Create your first todo list to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <CreateTodoListButton />
      {data.map((todoList: TodoList) => (
        <TodoListCard key={todoList.id} todoList={todoList} />
      ))}
    </div>
  );
}
