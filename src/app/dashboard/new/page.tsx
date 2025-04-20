import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { CreateTodoListForm } from '@/components/todo-lists/create-todo-list-form';

export default function NewTodoListPage() {
  return (
    <>
      <DashboardHeader
        description="Create a new list"
        backLink={{
          href: '/dashboard',
          label: 'Back to lists',
        }}
      />
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <CreateTodoListForm />
      </div>
    </>
  );
}
