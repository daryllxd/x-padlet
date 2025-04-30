'use client';

import { getEmojiVariants } from '@/lib/utils/emoji';
import type { Player } from '@lottiefiles/react-lottie-player';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

/**
 * We will state `ssr` to false, but Storybook needs a string ("false")
 * @see Next.js uses process.env, Storybook uses import.meta.env
 * @file vite-env.d.ts
 */
const LottiePlayer = dynamic<React.ComponentProps<typeof Player>>(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  {
    ssr: import.meta?.env?.STORYBOOK === 'true',
    loading: () => <div className="animate-pulse rounded-full bg-slate-200" />,
  }
);

interface EmojiDisplayProps {
  code: string;
  size?: number;
  className?: string;
}

/**
 * Displays an emoji using LottiePlayer
 * @param code - The code of the emoji to display
 * @param size - The size of the emoji to display
 * @param className - The className of the emoji to display
 * @see https://googlefonts.github.io/noto-emoji-animation/
 * @returns The emoji display component
 */
export function EmojiDisplay({ code, size = 32, className = '' }: EmojiDisplayProps) {
  const { animated } = getEmojiVariants(code);

  return (
    <div className={`selected-emoji ${className}`} style={{ width: size, height: size }}>
      <Suspense
        fallback={
          <div
            className="animate-pulse rounded-full bg-slate-200"
            style={{ width: '100%', height: '100%' }}
          />
        }
      >
        <LottiePlayer
          key={`lottie-${code}`}
          src={animated}
          autoplay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>
    </div>
  );
}
