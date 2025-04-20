'use client';

import { navigationItems } from '@/config/navigation';
import { navigationIcons } from '@/config/navigation-icons';
import { cn } from '@/lib/utils';
import { MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { XPadletLink } from '../ui/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';

export function NavMobileClient() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild className="mr-2 lg:hidden">
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-6 sm:w-[300px]">
        <SheetHeader>
          <SheetTitle className="text-left">Puglet</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-6">
          {navigationItems.map((item) => {
            const Icon = navigationIcons[item.icon];
            return (
              <XPadletLink variant="muted" href={item.href} key={item.href} className="w-full">
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    pathname === item.href && 'pointer-events-none'
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </XPadletLink>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NavMobileClient;
