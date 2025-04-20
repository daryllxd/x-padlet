import { ChevronLeft } from 'lucide-react';
import { XPadletLink } from '../ui/link';

interface DashboardHeaderProps {
  title?: string;
  description: string;
  backLink?: {
    href: string;
    label: string;
  };
}

export function DashboardHeader({ title = 'Puglet', description, backLink }: DashboardHeaderProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        <p className="flex w-full flex-row text-sm text-slate-600 sm:text-base">
          {description}
          {backLink && (
            <XPadletLink href={backLink.href} className="ms-auto flex flex-row items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              {backLink.label}
            </XPadletLink>
          )}
        </p>
      </div>
    </div>
  );
}
