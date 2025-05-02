'use client';

import { cn } from '@/lib/utils';
import { useCombobox } from 'downshift';
import * as React from 'react';

interface SelectProps {
  items: Array<{ value: string; label: string; color?: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Select({ items, value, onChange, placeholder, className }: SelectProps) {
  const [inputItems, setInputItems] = React.useState(items);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    selectedItem,
  } = useCombobox({
    items: inputItems,
    itemToString: (item) => (item ? item.label : ''),
    selectedItem: items.find((item) => item.value === value),
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem && onChange) {
        onChange(selectedItem.value);
      }
    },
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        items.filter((item) => item.label.toLowerCase().includes(inputValue?.toLowerCase() ?? ''))
      );
    },
  });

  return (
    <div className={cn('relative', className)}>
      <div className="flex flex-col gap-1">
        <div className="flex gap-0.5">
          <input
            {...getInputProps()}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
            placeholder={placeholder}
          />
          <button
            {...getToggleButtonProps()}
            className="border-input bg-background ring-offset-background focus:ring-ring rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            ▼
          </button>
        </div>
      </div>
      <ul
        {...getMenuProps()}
        className={cn(
          'bg-popover text-popover-foreground absolute z-[100] mt-1 max-h-80 w-full overflow-auto rounded-md border p-1 shadow-md',
          !isOpen && 'hidden'
        )}
      >
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              key={`${item.value}${index}`}
              {...getItemProps({ item, index })}
              className={cn(
                'relative flex cursor-pointer items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none',
                highlightedIndex === index && 'bg-accent text-accent-foreground',
                selectedItem?.value === item.value && 'font-bold'
              )}
            >
              {item.color && (
                <div className={`absolute left-2 h-4 w-4 rounded-full ${item.color}`} />
              )}
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
