'use client';

import { TodoCreateDialog } from '@/components/todos/todo-create-dialog';
import { TodoListAppearanceEditor } from '@/components/todos/todo-list-appearance-editor';
import { TodoListView } from '@/components/todos/todo-list-view';
import { useTodoList } from '@/hooks/useTodoLists';
import { useTodos } from '@/hooks/useTodos';
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
  Playpen_Sans: 'Playpen Sans, sans-serif',
} as const;

type ThemeColor = keyof typeof THEME_COLORS;
type Font = keyof typeof FONTS;

export default function TodoListPage({ params }: { params: Promise<{ todo_list_id: string }> }) {
  const router = useRouter();
  const { todo_list_id: todoListId } = use(params);
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');
  const [font, setFont] = useState<Font>('Playpen_Sans');

  const { data: todoList } = useTodoList(todoListId);
  const { todos } = useTodos(todoListId);

  useEffect(() => {
    if (todoList?.status === 'archived') {
      toast.error('This todo list is archived');

      setTimeout(() => {
        router.push('/');
      }, 500);
    }
  }, [todoList?.status]);

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
              </div>
              <p className="text-sm text-slate-500">{todoList?.description}</p>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row">
              <TodoCreateDialog listId={todoListId} />
              <TodoListAppearanceEditor
                themeColor={themeColor}
                font={font}
                onThemeColorChange={setThemeColor}
                onFontChange={setFont}
              />
            </div>
          </div>
        </header>

        <TodoListView todos={todos} listId={todoListId} />
      </div>
    </div>
  );
}
