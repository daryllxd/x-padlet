'use client';

import { MotionValue } from 'framer-motion';
import { createContext, useContext } from 'react';

interface NavContextType {
  scrollProgress: MotionValue<number>;
}

export const NavContext = createContext<NavContextType | null>(null);

export function useNavContext() {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNavContext must be used within a NavProvider');
  }
  return context;
}
