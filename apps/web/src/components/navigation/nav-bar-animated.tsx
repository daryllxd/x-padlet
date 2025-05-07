'use client';

import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { NavContext } from './nav-bar-animated-context';

interface NavBarAnimatedProps {
  children: React.ReactNode;
}

const MAX_HEADER_HEIGHT = 60;
const MIN_HEADER_HEIGHT = 40;

let clamp = (number: number, min: number, max: number) => Math.min(Math.max(number, min), max);

function useBoundedScroll(bounds: number) {
  let { scrollY } = useScroll();
  let scrollYBounded = useMotionValue(0);
  let scrollYBoundedProgress = useTransform(scrollYBounded, [0, bounds], [0, 1]);

  useEffect(() => {
    return scrollY.onChange((current) => {
      let previous = scrollY.getPrevious()!;
      let diff = current - previous;
      let newScrollYBounded = scrollYBounded.get() + diff;

      scrollYBounded.set(clamp(newScrollYBounded, 0, bounds));
    });
  }, [bounds, scrollY, scrollYBounded]);

  return { scrollYBounded, scrollYBoundedProgress };
}

export function NavBarAnimated({ children }: NavBarAnimatedProps) {
  let { scrollYBoundedProgress } = useBoundedScroll(400);
  let scrollYBoundedProgressThrottled = useTransform(
    scrollYBoundedProgress,
    [0, 0.75, 1],
    [0, 0, 1]
  );

  return (
    <NavContext.Provider value={{ scrollProgress: scrollYBoundedProgressThrottled }}>
      <motion.div
        className="fixed inset-x-0 w-full border-b bg-white"
        style={{
          height: useTransform(
            scrollYBoundedProgressThrottled,
            [0, 1],
            [MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT]
          ),
          backgroundColor: useMotionTemplate`rgb(255 255 255 / ${useTransform(
            scrollYBoundedProgressThrottled,
            [0, 1],
            [1, 0.5]
          )})`,
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        {children}
      </motion.div>
    </NavContext.Provider>
  );
}
