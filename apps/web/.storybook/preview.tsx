import type { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React, { ReactNode, useState } from 'react';
import '../src/app/globals.css';

const preview: Preview = {
  beforeAll: () => {
    initialize();
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    reactQuery: {
      showDevTools: false, // Default to false
    },
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
  loaders: [mswLoader],
  decorators: [
    (Story: () => ReactNode, context) => {
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

      const showDevTools = context.parameters.reactQuery?.showDevTools ?? false;

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
          {showDevTools && (
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
          )}
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
