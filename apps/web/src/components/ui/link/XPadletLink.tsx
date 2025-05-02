import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ComponentProps } from 'react';

type XPadletLinkProps = ComponentProps<typeof Link> & {
  variant?: 'link' | 'default' | 'muted' | 'destructive';
};

export function XPadletLink({ className, variant = 'link', target, ...props }: XPadletLinkProps) {
  return (
    <Link
      className={cn(
        'transition-colors duration-200',
        {
          'text-blue-600 underline-offset-4 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300':
            variant === 'link',
          'text-foreground hover:text-foreground/80': variant === 'default',
          'text-muted-foreground hover:text-muted-foreground/80': variant === 'muted',
          'text-destructive hover:text-destructive/80': variant === 'destructive',
        },
        className
      )}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      {...props}
    />
  );
}
