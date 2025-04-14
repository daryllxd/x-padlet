'use client';

import { TodoListHeroSection } from '@/components/todos/todo-list-hero-section';
import { TodoListView } from '@/components/todos/todo-list-view';
import { useTodos } from '@/hooks/useTodos';
import { use, useState } from 'react';

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
  const { todo_list_id: todoListId } = use(params);
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');
  const [font, setFont] = useState<Font>('Playpen_Sans');

  const { todos } = useTodos(todoListId);

  return (
    <div className={`min-h-screen ${THEME_COLORS[themeColor]}`} style={{ fontFamily: FONTS[font] }}>
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <TodoListHeroSection
          todoListId={todoListId}
          themeColor={themeColor}
          font={font}
          onThemeColorChange={setThemeColor}
          onFontChange={setFont}
        />

        <TodoListView todos={todos} listId={todoListId} />
      </div>
    </div>
  );
}
