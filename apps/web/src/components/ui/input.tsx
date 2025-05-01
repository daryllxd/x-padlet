import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        'flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs',

        // Text styles
        'text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',

        // File input styles
        'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',

        // Focus states
        'focus-visible:border-ring focus-visible:ring-ring/50 transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',

        // Disabled state
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',

        // Dark mode
        'dark:bg-input/30',

        // Error states
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',

        // Responsive text size
        'md:text-sm',

        className
      )}
      {...props}
    />
  );
}

export { Input };
