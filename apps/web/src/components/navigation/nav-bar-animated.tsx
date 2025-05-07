'use client';

import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion';

interface NavBarAnimatedProps {
  children: React.ReactNode;
}

const HEADER_HEIGHT = 60;
const MIN_HEADER_HEIGHT = 40;

export function NavBarAnimated({ children }: NavBarAnimatedProps) {
  let { scrollY } = useScroll();
  let height = useMotionValue(HEADER_HEIGHT);

  useMotionValueEvent(scrollY, 'change', (current) => {
    // Bang here cause I'm pretty sure this is not undefined
    let previous = scrollY.getPrevious()!;

    let diff = current - previous;
    let newHeight = height.get() - diff * 0.1;

    height.set(Math.min(Math.max(newHeight, MIN_HEADER_HEIGHT), HEADER_HEIGHT));
  });
  return (
    <motion.div
      className="fixed inset-x-0 w-full border-b bg-white"
      style={{ height }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
