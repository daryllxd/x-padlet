'use client';

import { navigationItems } from '@/config/navigation';
import { navigationIcons } from '@/config/navigation-icons';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { XPadletLink } from '../ui/link';

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="ml-4 hidden space-x-4 lg:flex">
      {navigationItems.map((item) => {
        const Icon = navigationIcons[item.icon];
        return (
          <XPadletLink variant="muted" href={item.href} key={item.href}>
            <Button
              variant={pathname.startsWith(item.href) ? 'default' : 'ghost'}
              className={cn('flex items-center', 'aria-[current=page]:pointer-events-none')}
              aria-current={item.href === pathname ? 'page' : undefined}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          </XPadletLink>
        );
      })}
    </div>
  );
}
