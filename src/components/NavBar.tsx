'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ListTodo, Presentation } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const pathname = usePathname();

  const links = [
    {
      name: 'Todo List',
      href: '/',
      icon: <ListTodo className="mr-2 h-4 w-4" />,
      active: pathname === '/',
    },
    {
      name: 'Presentation',
      href: '/presentation',
      icon: <Presentation className="mr-2 h-4 w-4" />,
      active: pathname === '/presentation',
    },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-4">
          <span className="text-lg font-bold">X-Padlet</span>
        </div>
        <div className="flex space-x-4">
          {links.map((link) => (
            <Link href={link.href} key={link.href}>
              <Button
                variant={link.active ? 'default' : 'ghost'}
                className={cn('flex items-center', link.active && 'pointer-events-none')}
              >
                {link.icon}
                {link.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
