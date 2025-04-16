import { useEffect, useRef } from 'react';

export function useBlinkOnRender<T extends HTMLElement>(ref: React.RefObject<T | null>) {
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
      }, 250);
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
}
