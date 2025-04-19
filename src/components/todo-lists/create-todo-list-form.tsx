'use client';

import { TODO_TEMPLATES } from '@/lib/templates/todo-templates';
import { TEMPLATE_IDS } from '@/types/todo-list-template';

export function CreateTodoListForm() {
  const createTodoListFromTemplate = async (formData: FormData) => {
    const response = await fetch('/api/todo-lists/create-from-template', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.log('response', response);
      throw new Error('Failed to create todo list');
    }

    const todoList = await response.json();
    window.location.href = `/${todoList.id}`;
  };

  return (
    <form action={createTodoListFromTemplate}>
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-slate-700">Choose a Template</label>
          <div className="mt-3 grid gap-4">
            {TEMPLATE_IDS.map((templateId) => {
              const template = TODO_TEMPLATES[templateId];
              return (
                <label
                  key={templateId}
                  className="relative flex cursor-pointer rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="templateId"
                    value={templateId}
                    className="peer sr-only"
                    required
                  />
                  <div className="flex flex-1 flex-col">
                    <span className="block text-sm font-medium text-slate-900">
                      {template.metadata.name}
                    </span>
                    <span className="mt-1 text-sm text-slate-500">
                      {template.metadata.description}
                    </span>
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-transparent peer-checked:border-blue-500" />
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Custom title for your todo list"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Custom description for your todo list"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Create Todo List
          </button>
        </div>
      </div>
    </form>
  );
}
