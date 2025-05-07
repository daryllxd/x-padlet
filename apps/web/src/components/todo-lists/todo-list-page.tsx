'use client';

import { TodoListHeroSection } from '@/components/todo-lists/todo-list-hero-section';
import { TodoListView } from '@/components/todo-lists/todo-list-view';
import { useTodoList } from '@/hooks/useTodoLists';
import { useTodos } from '@/hooks/useTodos';
import { useThemeStore } from '@/stores/theme-store';
import { useEffect, useState } from 'react';

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

/**
 * @description We pass in either a UUID or a URL in "todoListId" - we need to load the TodoList and get the real UUID first - then pass that UUID to the underlying components.
 */
export function TodoListPage({ todoListId: todoListIdOrUrl }: TodoListPageProps) {
  const { data: todoList } = useTodoList(todoListIdOrUrl);
  const todoListId = todoList?.id;
  const { todos, isLoading: isTodosLoading } = useTodos(todoListId ?? todoListIdOrUrl);
  const [font, setFont] = useState<Font>('Montserrat');
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    if (todoList?.theme) {
      setTheme(todoList.theme);
    }
  }, [todoList?.theme, setTheme]);

  return (
    <div className="min-h-screen" style={{ fontFamily: FONTS[font] }}>
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <TodoListHeroSection
          todoListId={todoListId ?? todoListIdOrUrl}
          themeColor={todoList?.theme || 'white'}
          font={font}
          onFontChange={setFont}
        />

        <TodoListView
          todos={todos}
          listId={todoListId ?? todoListIdOrUrl}
          displayMode={todoList?.display_mode || 'masonry'}
          isLoading={isTodosLoading}
        />
      </div>
    </div>
  );
}
