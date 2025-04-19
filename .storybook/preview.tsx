import type { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { ReactNode, useState } from 'react';

const preview: Preview = {
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
  },
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
