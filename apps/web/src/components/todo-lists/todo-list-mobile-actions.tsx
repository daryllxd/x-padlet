'use client';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useIsMobile';
import { TodoList } from '@/types/todo-list';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Plus, Settings2 } from 'lucide-react';
import { TodoCreateDialog } from '../todos/todo-create-dialog';
import { SheetTrigger } from '../ui/sheet';
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
    <div className="fixed right-0 bottom-0 left-0 z-50 grid h-[58px] auto-cols-fr grid-flow-col items-center gap-2 border-t bg-white p-2 text-xs">
      <TodoCreateDialog listId={todoListId}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full flex-col font-sans text-xs">
            <Plus className="mr-2 h-4 w-4" />
            Add Todo
          </Button>
        </DialogTrigger>
      </TodoCreateDialog>
      <TodoListAppearanceEditor
        todoListId={todoListId}
        themeColor={themeColor}
        font={font}
        displayMode={displayMode}
        onSave={onSave}
      >
        <SheetTrigger asChild>
          <Button variant="ghost" className="flex w-full flex-col text-xs">
            <Settings2 className="mr-2 h-4 w-4" />
            Appearance
          </Button>
        </SheetTrigger>
      </TodoListAppearanceEditor>
    </div>
  );
}
