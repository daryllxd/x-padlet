'use client';

import { TodoListHeroSection } from '@/components/todo-lists/todo-list-hero-section';
import { TodoListView } from '@/components/todo-lists/todo-list-view';
import { useTodoList } from '@/hooks/useTodoLists';
import { useTodos } from '@/hooks/useTodos';
import { TAILWIND_THEME_COLORS } from '@/types/todo-list';
import { useState } from 'react';
import { TodoEvents } from '../todos/todo-events';

const FONTS = {
  Inter: 'Inter, sans-serif',
  Roboto: 'Roboto, sans-serif',
  'Open Sans': 'Open Sans, sans-serif',
  Montserrat: 'Montserrat, sans-serif',
  Poppins: 'Poppins, sans-serif',
  Playpen_Sans: 'Playpen Sans, sans-serif',
} as const;

type Font = keyof typeof FONTS;

interface TodoListPageProps {
  todoListId: string;
}

export function TodoListPage({ todoListId }: TodoListPageProps) {
  const { data: todoList } = useTodoList(todoListId);
  const { todos, isLoading: isTodosLoading } = useTodos(todoListId);
  const [font, setFont] = useState<Font>('Playpen_Sans');

  return (
    <div
      className={`min-h-screen ${TAILWIND_THEME_COLORS[todoList?.theme || 'white']}`}
      style={{ fontFamily: FONTS[font] }}
    >
      <TodoEvents todoListId={todoListId} />
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <TodoListHeroSection
          todoListId={todoListId}
          themeColor={todoList?.theme || 'white'}
          font={font}
          onFontChange={setFont}
        />

        <TodoListView
          todos={todos}
          listId={todoListId}
          displayMode={todoList?.display_mode || 'masonry'}
          isLoading={isTodosLoading}
        />
      </div>
    </div>
  );
}
