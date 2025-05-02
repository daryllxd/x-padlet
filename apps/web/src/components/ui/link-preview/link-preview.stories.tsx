import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import LinkPreview from './link-preview';

const meta = {
  title: 'UI/LinkPreview',
  component: LinkPreview,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LinkPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

// export const MockedSuccess = {
//   parameters: {
//     msw: {
//       handlers: [
//         http.get('https://swapi.dev/api/films/', () => {
//           return HttpResponse.json({
//             results: films,
//           })
//         }),
//       ],
//     },
//   },
// }

export const YouTube: Story = {
  args: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/metadata', () => {
          return new HttpResponse(
            JSON.stringify({
              title: 'Never Gonna Give You Up - Rick Astley',
              description: 'Official music video for Rick Astley - Never Gonna Give You Up (Video)',
              image: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
              favicon: 'https://www.youtube.com/favicon.ico',
              siteName: 'YouTube',
            }),
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }),
      ],
    },
  },
};

export const Notion: Story = {
  args: {
    url: 'https://www.notion.so/Getting-Started-Guide-123',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/metadata', () => {
          return HttpResponse.json({
            title: 'Getting Started with Notion',
            description:
              'A complete guide to getting started with Notion. Learn how to organize your work and life.',
            image: 'https://www.notion.so/images/meta/default.png',
            favicon: 'https://www.notion.so/images/favicon.ico',
            siteName: 'Notion',
          });
        }),
      ],
    },
  },
};

export const Reddit: Story = {
  args: {
    url: 'https://www.reddit.com/r/nextjs/comments/best_practices',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/metadata', () => {
          return HttpResponse.json({
            title: 'Next.js Best Practices for 2024',
            description:
              'A comprehensive guide to Next.js best practices and tips from the community.',
            image: 'https://styles.redditmedia.com/t5_2su6s/styles/communityIcon_4g1uo0kd87c41.png',
            favicon: 'https://www.reddit.com/favicon.ico',
            siteName: 'Reddit',
            // Reddit-specific metadata
            subreddit: 'nextjs',
            upvotes: '2.5k',
            comments: '342',
          });
        }),
      ],
    },
  },
};
