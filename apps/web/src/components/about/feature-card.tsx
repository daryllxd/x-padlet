'use client';

import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';
interface FeatureCardProps extends ComponentProps<'div'> {
  title: string;
  icon?: string;
}

export function FeatureCard({ title, icon, children, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md',
        className
      )}
    >
      {icon && <div className="mb-4 text-2xl">{icon}</div>}
      <h3 className="mb-2 text-xl font-semibold text-slate-800">{title}</h3>
      {children}
    </div>
  );
}
