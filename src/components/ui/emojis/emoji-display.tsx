'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LottiePlayer = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  {
    ssr: false,
    loading: () => <div className="animate-pulse rounded-full bg-slate-200" />,
  }
);

interface EmojiDisplayProps {
  code: string; // e.g. '1f603' for 😃
  size?: number;
  className?: string;
}

export function EmojiDisplay({ code, size = 32, className = '' }: EmojiDisplayProps) {
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
          src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/lottie.json`}
          autoplay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>
    </div>
  );
}
