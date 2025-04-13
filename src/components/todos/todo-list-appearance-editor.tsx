'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Settings2 } from 'lucide-react';
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

interface TodoListAppearanceEditorProps {
  themeColor: ThemeColor;
  font: Font;
  onThemeColorChange: (color: ThemeColor) => void;
  onFontChange: (font: Font) => void;
}

export function TodoListAppearanceEditor({
  themeColor,
  font,
  onThemeColorChange,
  onFontChange,
}: TodoListAppearanceEditorProps) {
  const { isMobile } = useIsMobile();

  return (
    <Sheet>
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
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className="px-6 max-sm:rounded-t-lg max-sm:pb-12 sm:w-[400px] sm:max-w-[400px]"
      >
        <SheetHeader className="px-0">
          <SheetTitle>Appearance Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Theme Color</h3>
            <div className="flex gap-2">
              {Object.keys(THEME_COLORS).map((color) => (
                <button
                  key={color}
                  onClick={() => onThemeColorChange(color as ThemeColor)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    THEME_COLORS[color as ThemeColor]
                  } ${themeColor === color ? 'border-slate-900' : 'border-transparent'}`}
                  title={color}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Font</h3>
            <select
              value={font}
              onChange={(e) => onFontChange(e.target.value as Font)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-slate-400 focus:outline-none"
              style={{ fontFamily: FONTS[font] }}
            >
              {Object.keys(FONTS).map((font) => (
                <option key={font} value={font} style={{ fontFamily: FONTS[font as Font] }}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
