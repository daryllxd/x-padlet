'use client';

import { navigationItems } from '@/config/navigation';
import { navigationIcons } from '@/config/navigation-icons';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { XPadletLink } from './ui/link';

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-4">
          <Link href="/" className="flex items-center text-lg font-bold">
            <Image
              src="/puglet.png"
              alt="Puglet"
              width={48}
              height={48}
              className="mr-2"
              priority
            />
            Puglet
          </Link>
        </div>
        <div className="flex space-x-4">
          {navigationItems.map((item) => {
            const Icon = navigationIcons[item.icon];
            return (
              <XPadletLink variant="muted" href={item.href} key={item.href}>
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  className={cn(
                    'flex items-center',
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
      </div>
    </nav>
  );
}
