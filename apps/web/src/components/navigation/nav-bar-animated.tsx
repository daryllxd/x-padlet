'use client';

import { motion, useScroll } from 'framer-motion';
import { useEffect } from 'react';

interface NavBarAnimatedProps {
  children: React.ReactNode;
}

export function NavBarAnimated({ children }: NavBarAnimatedProps) {
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((current) => {
      console.log(current);
    });
  }, [scrollY]);

  return (
    <motion.div
      className="fixed inset-x-0 h-14 w-full border-b bg-white"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
