'use client';

import { TodoCreateDialog } from '@/components/todos/todo-create-dialog';
import { TodoListView } from '@/components/todos/todo-list-view';
import { useTodoList } from '@/hooks/useTodoLists';
import { useTodos } from '@/hooks/useTodos';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';

const THEME_COLORS = {
  red: 'bg-red-100',
  yellow: 'bg-yellow-100',
  green: 'bg-green-100',
  purple: 'bg-purple-100',
  blue: 'bg-blue-100',
  white: 'bg-white',
} as const;

const FONTS = {
  Inter: 'Inter, sans-serif',
  Roboto: 'Roboto, sans-serif',
  'Open Sans': 'Open Sans, sans-serif',
  Montserrat: 'Montserrat, sans-serif',
  Poppins: 'Poppins, sans-serif',
} as const;

type ThemeColor = keyof typeof THEME_COLORS;
type Font = keyof typeof FONTS;

export default function TodoListPage({ params }: { params: Promise<{ todo_list_id: string }> }) {
  const router = useRouter();
  const { todo_list_id: todoListId } = use(params);
  const [themeColor, setThemeColor] = useState<ThemeColor>('white');
  const [font, setFont] = useState<Font>('Inter');

  const { data: todoList } = useTodoList(todoListId);
  const { todos, isLoading } = useTodos(todoListId);

  useEffect(() => {
    if (todoList?.status === 'archived') {
      toast.error('This todo list is archived');

      setTimeout(() => {
        router.push('/');
      }, 500);
    }
  }, [todoList?.status]);

  if (isLoading) {
    return null;
  }

  if (todoList?.status === 'archived') {
    return null;
  }

  return (
    <div className={`min-h-screen ${THEME_COLORS[themeColor]}`} style={{ fontFamily: FONTS[font] }}>
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 sm:gap-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold sm:text-3xl">{todoList?.title}</h1>
                {todos && todos.length > 0 && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm text-slate-600">
                    {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">{todoList?.description}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Theme:</span>
                <div className="flex gap-1">
                  {Object.keys(THEME_COLORS).map((color) => (
                    <button
                      key={color}
                      onClick={() => setThemeColor(color as ThemeColor)}
                      className={`h-6 w-6 rounded-full border-2 ${
                        THEME_COLORS[color as ThemeColor]
                      } ${themeColor === color ? 'border-slate-900' : 'border-transparent'}`}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Font:</span>
                <div className="relative">
                  <select
                    value={font}
                    onChange={(e) => setFont(e.target.value as Font)}
                    className="appearance-none rounded-md border border-slate-200 bg-white px-3 py-1.5 pr-8 text-sm focus:ring-2 focus:ring-slate-400 focus:outline-none"
                    style={{ fontFamily: FONTS[font] }}
                  >
                    {Object.keys(FONTS).map((font) => (
                      <option key={font} value={font} style={{ fontFamily: FONTS[font as Font] }}>
                        {font}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
              <TodoCreateDialog listId={todoListId} />
            </div>
          </div>
        </header>

        {todos && todos.length > 0 ? (
          <TodoListView todos={todos} listId={todoListId} />
        ) : (
          <div className="m-10 flex flex-col items-center justify-center text-slate-500 sm:m-20">
            <Image
              src="/meditating-doodle.svg"
              alt="Meditating Doodle"
              className="h-32 w-32 sm:h-40 sm:w-40"
              width={160}
              height={160}
            />
            <p className="mt-4 text-center">Nothing yet here! Let's get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
