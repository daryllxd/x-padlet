'use client';

import { Button } from '@/components/ui/button';
import { XPadletLink } from '@/components/ui/link';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const useBlinkOnRender = <T extends HTMLElement>(ref: React.RefObject<T | null>) => {
  const renderCount = useRef(0);
  let timeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    renderCount.current += 1;
  });

  useEffect(() => {
    if (ref?.current) {
      ref.current.style.borderColor = 'red';

      timeout = setTimeout(() => {
        if (ref?.current) {
          ref.current.style.borderColor = 'var(--gray-200)';
        }
      }, 100);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [renderCount.current, ref]);

  return {
    renderCount: renderCount.current,
  };
};

// Regular (non-memoized) component
function RegularCounter({
  count,
  onIncrement,
  text = 'Regular',
}: {
  count: number;
  onIncrement: () => void;
  text?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const { renderCount } = useBlinkOnRender(divRef);

  return (
    <div className="grid gap-2 rounded-lg border border-gray-200 p-4" ref={divRef}>
      <p>{text}</p>
      <p>Count: {count}</p>
      <p>Render Count: {renderCount}</p>
      <Button onClick={onIncrement}>Increment</Button>
    </div>
  );
}

const MemoizedWithMemoCounter = memo(RegularCounter);

export default function ReactPerformancePage() {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState('');

  // Memoized callback
  const handleIncrementMemoized = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  // Non-memoized callback
  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const memoized = useMemo(() => {
    return (
      <RegularCounter
        text="Memoized with useMemo"
        count={count}
        onIncrement={handleIncrementMemoized}
      />
    );
  }, [count, handleIncrementMemoized]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">React Memoization Examples</h1>

      <div className="space-y-8">
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Regular vs Memoized Components</h2>
          <p className="mb-4">
            Check the code out at{' '}
            <XPadletLink variant="link" href="https://github.com/daryllxd/x-padlet/pull/58">
              PR #58
            </XPadletLink>
          </p>
          <p className="mb-4">
            Type in the input below to see the difference in re-rendering behavior. The regular
            counter will re-render on every input change, while the memoized one won't.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RegularCounter
              text="Regular (non-memoized callback)"
              count={count}
              onIncrement={handleIncrement}
            />
            <MemoizedWithMemoCounter
              text="Memoized with React.memo (non-memoized callback)"
              count={count}
              onIncrement={handleIncrement}
            />
            <MemoizedWithMemoCounter
              text="Memoized with React.memo (memoized callback)"
              count={count}
              onIncrement={handleIncrementMemoized}
            />
            {memoized}
          </div>

          <div className="mt-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type here to see re-rendering differences"
              className="w-full rounded border px-4 py-2"
            />
            <p className="mt-2">Input Value: {inputValue}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
