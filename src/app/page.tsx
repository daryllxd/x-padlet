import { CreateTodoListButton } from '@/components/todos/create-todo-list-button';
import { TodoListCard } from '@/components/todos/todo-list-card';
import { fetchTodoLists } from '@/lib/api/todoLists';
import { TodoList } from '@/types/todo';

export default async function Home() {
  const todoLists = await fetchTodoLists();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">My Work</h1>
            <p className="text-slate-500">Manage and organize your tasks efficiently</p>
          </div>
          <CreateTodoListButton />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {todoLists?.map((list: TodoList) => (
            <TodoListCard
              key={list.id}
              id={list.id}
              title={list.title}
              description={list.description}
              todoCount={list.todoCount}
            />
          ))}
        </div>

        {todoLists?.length === 0 && (
          <div className="mt-12 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
            <h3 className="text-xl font-medium text-slate-900">No todo lists yet</h3>
            <p className="mt-2 text-slate-500">Create your first todo list to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
