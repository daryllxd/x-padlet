'use client';

import { getEmojiVariants } from '@/lib/utils/emoji';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LottiePlayer = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  {
    ssr: false,
    loading: () => <div className="animate-pulse rounded-full bg-slate-200" />,
  }
) as any; // Temporary type assertion to fix the error

interface EmojiDisplayProps {
  code: string;
  size?: number;
  className?: string;
}

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
