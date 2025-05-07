'use server';

import { cn } from '@/lib/utils';
import { getZIndex } from '@/lib/z-index';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { NavBarAnimated } from './nav-bar-animated';
import { NavLinks } from './nav-links';
import { NavMobile } from './nav-mobile';

export async function NavBar() {
  const headersList = await headers();
  const host = headersList.get('host');
  const isKawaiiPug = host === 'kawaii-pug.daryll.codes';

  return (
    <nav
      className={cn(
        isKawaiiPug && 'border-b-purple-300 bg-gradient-to-b from-blue-200 to-purple-200'
      )}
      style={{ zIndex: getZIndex('header') }}
    >
      <NavBarAnimated>
        <div className="container mx-auto flex h-14 items-center px-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-lg font-bold">
              <Image
                src={isKawaiiPug ? '/kawaii-pug.webp' : '/puglet.png'}
                alt="Puglet"
                width={48}
                height={48}
                className="mr-2"
                priority
              />
              {isKawaiiPug ? 'Kawaii Pug' : 'Puglet'}
            </Link>
          </div>

          <NavLinks />

          <div className="ml-auto">
            <NavMobile />
          </div>
        </div>
      </NavBarAnimated>
    </nav>
  );
}
