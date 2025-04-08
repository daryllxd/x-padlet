'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Info, ListTodo } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { XPadletLink } from './ui/link';

export function NavBar() {
  const pathname = usePathname();

  const links = [
    {
      name: 'My work',
      href: '/',
      icon: <ListTodo className="mr-2 h-4 w-4" />,
      active: pathname === '/',
    },
    {
      name: 'About',
      href: '/about',
      icon: <Info className="mr-2 h-4 w-4" />,
      active: pathname === '/about',
    },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-4">
          <span className="text-lg font-bold">🧑‍🎨 X-Padlet</span>
        </div>
        <div className="flex space-x-4">
          {links.map((link) => (
            <XPadletLink href={link.href} key={link.href}>
              <Button
                variant={link.active ? 'default' : 'ghost'}
                className={cn('flex items-center', link.active && 'pointer-events-none')}
              >
                {link.icon}
                {link.name}
              </Button>
            </XPadletLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
