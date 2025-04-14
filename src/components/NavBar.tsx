'use client';

import { cn } from '@/lib/utils';
import { HomeIcon, ShieldQuestion } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { XPadletLink } from './ui/link';

export function NavBar() {
  const pathname = usePathname();

  const links = [
    {
      name: 'My work',
      href: '/',
      icon: <HomeIcon className="mr-2 h-4 w-4" />,
      active: pathname === '/',
    },
    {
      name: 'About',
      href: '/about',
      icon: <ShieldQuestion className="mr-2 h-4 w-4" />,
      active: pathname === '/about',
    },
  ];

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
