import { CreateTodoListForm } from '@/components/todo-lists/create-todo-list-form';

export default function NewTodoListPage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="mb-6 text-2xl font-bold">Create New Todo List</h1>
        <CreateTodoListForm />
      </div>
    </div>
  );
}
