'use client';

import { TodoListAppearanceEditor } from '@/components/todo-lists/todo-list-appearance-editor';
import { TodoListMobileActions } from '@/components/todo-lists/todo-list-mobile-actions';
import { EmojiDisplay } from '@/components/ui/emojis/emoji-display';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTodoList } from '@/hooks/useTodoLists';
import { useUpdateTodoList } from '@/hooks/useUpdateTodoList';
import { EMOJI_MAP } from '@/lib/utils/emoji';
import { isObjectKeysTraversing } from '@/lib/utils/is-object-keys-traversing';
import { TodoList } from '@x-padlet/types';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { TodoCreateDialog } from '../todos/todo-create-dialog';

const FONTS = {
  Inter: 'Inter, sans-serif',
  Roboto: 'Roboto, sans-serif',
  'Open Sans': 'Open Sans, sans-serif',
  Montserrat: 'Montserrat, sans-serif',
  Poppins: 'Poppins, sans-serif',
  Playpen_Sans: 'Playpen Sans, sans-serif',
} as const;

type Font = keyof typeof FONTS;
interface TodoListHeaderProps {
  todoListId: string;
  themeColor: TodoList['theme'];
  font: Font;
  onFontChange: (font: Font) => void;
}

export function TodoListHeroSection({ todoListId, themeColor, font }: TodoListHeaderProps) {
  const { data: todoList, isPending, error } = useTodoList(todoListId);
  const router = useRouter();
  const { mutate: updateTodoList } = useUpdateTodoList();
  const { isMobile } = useIsMobile();

  useEffect(() => {
    if (todoList?.status === 'archived') {
      toast.error('This todo list is archived');

      setTimeout(() => {
        router.push('/');
      }, 500);
    }
  }, [todoList?.status]);

  const { title, description, status } = todoList ?? {};

  if (status === 'archived') {
    return null;
  }

  const onSave = (settings: {
    themeColor: TodoList['theme'];
    font: Font;
    displayMode: TodoList['display_mode'];
    icon?: string | null;
  }) => {
    updateTodoList({
      id: todoListId,
      theme: settings.themeColor,
      displayMode: settings.displayMode,
      icon: settings.icon,
    });
  };

  if (isPending) {
    return (
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-48 animate-pulse rounded-md bg-slate-200 sm:h-10" />
            </div>
            <div className="h-4 w-64 animate-pulse rounded-md bg-slate-200" />
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="h-10 w-32 animate-pulse rounded-md bg-slate-200" />
            <div className="h-10 w-32 animate-pulse rounded-md bg-slate-200" />
          </div>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
          <AlertCircle className="h-8 w-8" />
          <div className="text-center">
            <h2 className="text-lg font-semibold">Error loading todo list</h2>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      </header>
    );
  }

  const iconKey =
    todoList?.icon && isObjectKeysTraversing(EMOJI_MAP, todoList?.icon)
      ? EMOJI_MAP[todoList.icon as keyof typeof EMOJI_MAP]
      : null;

  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 sm:gap-2">
          <div className="flex items-center gap-2">
            {iconKey && <EmojiDisplay code={iconKey} size={24} />}
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          </div>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div className="hidden flex-col gap-4 sm:flex lg:flex-row">
          <TodoCreateDialog listId={todoListId} />
          <TodoListAppearanceEditor
            todoListId={todoListId}
            themeColor={themeColor}
            font={font}
            displayMode={todoList?.display_mode}
            onSave={onSave}
          />
        </div>
      </div>
      <TodoListMobileActions
        todoListId={todoListId}
        themeColor={themeColor}
        font={font}
        displayMode={todoList?.display_mode}
        onSave={onSave}
      />
    </header>
  );
}
