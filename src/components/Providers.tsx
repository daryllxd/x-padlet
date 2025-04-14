'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createContext, useState } from 'react';
import { CmdkPalette } from './CmdkPalette';

/**
 *  @description The expansion state of the Dev tools still depends on you clicking the dev tools button
 *  @todo If react-query is able to expose expanding and collapsing the dev tools, we can add it to his context
 */
export const DevToolsContext = createContext({
  isReactQueryDevtoolsOpen: false,
  setIsReactQueryDevtoolsOpen: (isOpen: boolean) => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [isReactQueryDevtoolsOpen, setIsReactQueryDevtoolsOpen] = useState(false);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
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
