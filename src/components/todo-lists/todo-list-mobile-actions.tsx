'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import { TodoList } from '@/types/todo-list';
import { TodoCreateDialog } from '../todos/todo-create-dialog';
import { TodoListAppearanceEditor } from './todo-list-appearance-editor';

const FONTS = {
  Inter: 'Inter, sans-serif',
  Roboto: 'Roboto, sans-serif',
  'Open Sans': 'Open Sans, sans-serif',
  Montserrat: 'Montserrat, sans-serif',
  Poppins: 'Poppins, sans-serif',
  Playpen_Sans: 'Playpen Sans, sans-serif',
} as const;

type Font = keyof typeof FONTS;

interface TodoListMobileActionsProps {
  todoListId: string;
  themeColor: TodoList['theme'];
  font: Font;
  displayMode: TodoList['display_mode'];
  onSave: (settings: {
    themeColor: TodoList['theme'];
    font: Font;
    displayMode: TodoList['display_mode'];
  }) => void;
}

export function TodoListMobileActions({
  todoListId,
  themeColor,
  font,
  displayMode,
  onSave,
}: TodoListMobileActionsProps) {
  const { isMobile } = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex h-14 items-center justify-around border-t bg-white px-4">
      <TodoCreateDialog listId={todoListId} />
      <TodoListAppearanceEditor
        todoListId={todoListId}
        themeColor={themeColor}
        font={font}
        displayMode={displayMode}
        onSave={onSave}
      />
    </div>
  );
}
