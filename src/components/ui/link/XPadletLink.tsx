import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ComponentProps } from 'react';

type XPadletLinkProps = ComponentProps<typeof Link> & {
  variant?: 'default' | 'muted' | 'destructive';
};

export function XPadletLink({
  className,
  variant = 'default',
  target,
  ...props
}: XPadletLinkProps) {
  return (
    <Link
      className={cn(
        {
          'text-foreground': variant === 'default',
          'text-muted-foreground': variant === 'muted',
          'text-destructive': variant === 'destructive',
        },
        className
      )}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      {...props}
    />
  );
}
