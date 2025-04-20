import Image from 'next/image';
import Link from 'next/link';
import { NavLinks } from './nav-links';
import { NavMobile } from './nav-mobile';

export function NavBar() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="flex items-center">
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

        <NavLinks />

        <div className="ml-auto">
          <NavMobile />
        </div>
      </div>
    </nav>
  );
}
