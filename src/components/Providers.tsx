'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createContext, useState } from 'react';
import { CmdkPalette } from './CmdkPalette';

interface DevToolsContextProps<T> {
  isReactQueryDevtoolsOpen: T;
  setIsReactQueryDevtoolsOpen: React.Dispatch<React.SetStateAction<T>>;
}
/**
 *  @description The expansion state of the Dev tools still depends on you clicking the dev tools button
 *  @todo If react-query is able to expose expanding and collapsing the dev tools, we can add it to his context
 */
export const DevToolsContext = createContext<DevToolsContextProps<boolean>>({
  isReactQueryDevtoolsOpen: false,
  setIsReactQueryDevtoolsOpen: () => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [isReactQueryDevtoolsOpen, setIsReactQueryDevtoolsOpen] =
    useState<DevToolsContextProps<boolean>['isReactQueryDevtoolsOpen']>(false);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <DevToolsContext.Provider value={{ isReactQueryDevtoolsOpen, setIsReactQueryDevtoolsOpen }}>
        {children}
        <CmdkPalette />
        {isReactQueryDevtoolsOpen && (
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        )}
      </DevToolsContext.Provider>
    </QueryClientProvider>
  );
}
