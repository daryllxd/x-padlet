# X-Padlet

A modern todo list application built with Next.js and Supabase.

![Preview](/public/preview-view-list.png)

[![Live Demo](https://img.shields.io/badge/🔋_Live_demo-Hello-green)](https://x-padlet.vercel.app)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/daryll-santos/)

## What's it do?

I wanted to create a side project that would keep track of things + to learn and re-learn some front-end concepts!

## Tech Stack

- **NextJS**
- **TypeScript**
- **Tailwind CSS**
- **ShadCN UI**
- **Lucide Icons**
- **TanStack Query**
- **Supabase**
- [**Pragmatic Drag and drop**](https://atlassian.design/components/pragmatic-drag-and-drop/)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at [http://localhost:3001](http://localhost:3001)

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── todos/       # Todo-related components
│   └── ui/          # UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── types/           # TypeScript types
└── styles/          # Global styles
```

## Development

- [**Cmd-K**](https://react-cmdk.com/): Keyboard shortcuts to go around
- **Code Formatting**: Uses Prettier
- **Type Checking**: TypeScript strict mode
- **Linting**: ESLint with Next.js config
- **Testing**: (Coming soon)
