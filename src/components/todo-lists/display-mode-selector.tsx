'use client';

import { cn } from '@/lib/utils';
import Downshift from 'downshift';
import { LayoutGrid, LayoutList } from 'lucide-react';

const DISPLAY_MODES = [
  {
    value: 'masonry',
    label: 'Masonry',
    icon: LayoutGrid,
    description: 'Items are arranged in a masonry grid layout',
  },
  {
    value: 'columnar',
    label: 'Columnar',
    icon: LayoutList,
    description: 'Items are arranged in a single column',
  },
];

type DisplayMode = (typeof DISPLAY_MODES)[number]['value'];
type DisplayModeItem = (typeof DISPLAY_MODES)[number];

interface DisplayModeSelectorProps {
  value: DisplayMode;
  onChange: (value: DisplayMode) => void;
  className?: string;
}

export function DisplayModeSelector({ value, onChange, className }: DisplayModeSelectorProps) {
  const selectedMode = DISPLAY_MODES.find((mode) => mode.value === value);

  return (
    <Downshift<DisplayModeItem>
      selectedItem={DISPLAY_MODES.find((mode) => mode.value === value) ?? null}
      onChange={(selectedItem) => {
        if (selectedItem) {
          onChange(selectedItem.value);
        }
      }}
    >
      {({ getToggleButtonProps, getMenuProps, getItemProps, isOpen, highlightedIndex }) => (
        <div className={cn('relative', className)}>
          <button
            {...getToggleButtonProps()}
            className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-slate-400 focus:outline-none"
          >
            <div className="flex items-center gap-2">
              {selectedMode && <selectedMode.icon className="h-4 w-4" />}
              <span>{selectedMode?.label}</span>
            </div>
            <svg
              className="h-4 w-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <ul
            {...getMenuProps()}
            className={cn(
              'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg',
              !isOpen && 'hidden'
            )}
          >
            {isOpen &&
              DISPLAY_MODES.map((item, index) => (
                <li
                  key={item.value}
                  {...getItemProps({
                    item,
                    index,
                  })}
                  className={cn(
                    'flex cursor-pointer flex-col gap-1 px-3 py-2',
                    highlightedIndex === index && 'bg-slate-100',
                    value === item.value && 'bg-slate-50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </li>
              ))}
          </ul>
        </div>
      )}
    </Downshift>
  );
}
