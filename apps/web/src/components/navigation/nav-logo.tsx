'use client';

import { motion, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useNavContext } from './nav-bar-animated-context';

interface NavLogoProps {
  isKawaiiPug: boolean;
}

export function NavLogo({ isKawaiiPug }: NavLogoProps) {
  const { scrollProgress } = useNavContext();
  const scale = useTransform(scrollProgress, [0, 1], [1, 0.8]);
  const imageSize = useTransform(scrollProgress, [0, 1], [48, 32]);

  return (
    <motion.div style={{ scale }}>
      <Link href="/" className="flex items-center text-lg font-bold">
        <motion.div style={{ width: imageSize, height: imageSize }}>
          <Image
            src={isKawaiiPug ? '/kawaii-pug.webp' : '/puglet.png'}
            alt="Puglet"
            width={48}
            height={48}
            className="mr-2"
            priority
          />
        </motion.div>
        {isKawaiiPug ? 'Kawaii Pug' : 'Puglet'}
      </Link>
    </motion.div>
  );
}
