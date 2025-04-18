'use client';

import { TodoListHeroSection } from '@/components/todos/todo-list-hero-section';
import { TodoListView } from '@/components/todos/todo-list-view';
import { useTodoList } from '@/hooks/useTodoLists';
import { useTodos } from '@/hooks/useTodos';
import { TAILWIND_THEME_COLORS } from '@/types/todo-list';
import { use, useState } from 'react';

const FONTS = {
  Inter: 'Inter, sans-serif',
  Roboto: 'Roboto, sans-serif',
  'Open Sans': 'Open Sans, sans-serif',
  Montserrat: 'Montserrat, sans-serif',
  Poppins: 'Poppins, sans-serif',
  Playpen_Sans: 'Playpen Sans, sans-serif',
} as const;

type Font = keyof typeof FONTS;

export default function TodoListPage({ params }: { params: Promise<{ todo_list_id: string }> }) {
  const { todo_list_id: todoListId } = use(params);
  const { data: todoList } = useTodoList(todoListId);
  const { todos } = useTodos(todoListId);
  const [font, setFont] = useState<Font>('Playpen_Sans');

  return (
    <div
      className={`min-h-screen ${TAILWIND_THEME_COLORS[todoList?.theme || 'white']}`}
      style={{ fontFamily: FONTS[font] }}
    >
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <TodoListHeroSection
          todoListId={todoListId}
          themeColor={todoList?.theme || 'white'}
          font={font}
        />

        <TodoListView
          todos={todos}
          listId={todoListId}
          displayMode={todoList?.display_mode || 'masonry'}
        />
      </div>
    </div>
  );
}
