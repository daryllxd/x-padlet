'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/useIsMobile';
import { isObjectKeysTraversing } from '@/lib/utils/is-object-keys-traversing';
import { TAILWIND_THEME_COLORS, TodoList } from '@/types/todo-list';
import { Settings2 } from 'lucide-react';
import { useState } from 'react';
import { useMount } from 'react-use';
import { DisplayModeSelector } from '../todo-lists/display-mode-selector';
import { QRCode } from '../ui/qr-code';

const FONTS = {
  Inter: 'Inter, sans-serif',
  Roboto: 'Roboto, sans-serif',
  'Open Sans': 'Open Sans, sans-serif',
  Montserrat: 'Montserrat, sans-serif',
  Poppins: 'Poppins, sans-serif',
  Playpen_Sans: 'Playpen Sans, sans-serif',
} as const;

type Font = keyof typeof FONTS;

interface TodoListAppearanceEditorProps {
  themeColor: TodoList['theme'];
  font: Font;
  displayMode: TodoList['display_mode'];
  todoListId: string;
  onSave: (settings: {
    themeColor: TodoList['theme'];
    font: Font;
    displayMode: TodoList['display_mode'];
  }) => void;
}

export function TodoListAppearanceEditor({
  themeColor,
  font,
  displayMode,
  todoListId,
  onSave,
}: TodoListAppearanceEditorProps) {
  const { isMobile } = useIsMobile();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [previewSettings, setPreviewSettings] = useState({
    themeColor,
    font,
    displayMode,
  });

  useMount(() => {
    setMounted(true);
  });

  const handleSave = () => {
    onSave(previewSettings);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {isMobile ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button>
                <Settings2 className="h-4 w-4" />
                <span className="sr-only">Open appearance settings</span>
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Appearance Settings</p>
          </TooltipContent>
        </Tooltip>
      ) : null}
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className="flex flex-col px-6 max-sm:rounded-t-lg max-sm:pb-12 sm:w-[400px] sm:max-w-[400px]"
      >
        <SheetHeader className="px-0">
          <SheetTitle>Appearance Settings</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Theme Color</h3>
            <div className="flex gap-2">
              {Object.keys(TAILWIND_THEME_COLORS).map((color) => {
                if (isObjectKeysTraversing(TAILWIND_THEME_COLORS, color)) {
                  return (
                    <button
                      key={color}
                      onClick={() =>
                        setPreviewSettings((prev) => ({
                          ...prev,
                          themeColor: color as TodoList['theme'],
                        }))
                      }
                      className={`h-8 w-8 rounded-full border-2 ${
                        TAILWIND_THEME_COLORS[color]
                      } ${previewSettings.themeColor === color ? 'border-slate-900' : 'border-slate-200'}`}
                      title={color}
                    />
                  );
                }
              })}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Font</h3>
            <select
              value={previewSettings.font}
              onChange={(e) =>
                setPreviewSettings((prev) => ({ ...prev, font: e.target.value as Font }))
              }
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-slate-400 focus:outline-none"
              style={{ fontFamily: FONTS[previewSettings.font] }}
            >
              {Object.keys(FONTS).map((font) => (
                <option key={font} value={font} style={{ fontFamily: FONTS[font as Font] }}>
                  {font}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full space-y-2">
            <h3 className="text-sm font-medium">Display Mode</h3>
            <DisplayModeSelector
              className="w-full"
              value={previewSettings.displayMode}
              onChange={(newMode) =>
                setPreviewSettings((prev) => ({
                  ...prev,
                  displayMode: newMode as TodoList['display_mode'],
                }))
              }
            />
          </div>

          {mounted && (
            <QRCode
              url={`${window.location.origin}/board/${todoListId}`}
              size={96}
              className="text-current opacity-80 transition-opacity hover:opacity-100"
            />
          )}
        </div>
        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => setPreviewSettings({ themeColor, font, displayMode })}
          >
            Reset
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
