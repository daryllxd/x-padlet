# X-Padlet

A modern todo list application built with Next.js and Supabase.

![Preview](/public/preview-view-list.png)

[![Live Demo](https://img.shields.io/badge/🔋_Live_demo-Hello-green)](https://x-padlet.vercel.app)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/daryll-santos/)

## What's it do?

I wanted to create a side project that would keep track of things + to learn and re-learn some front-end concepts!

## Tech Stack

[![Next.js](https://img.shields.io/badge/NextJS-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query/latest)
[![Shadcn UI](https://img.shields.io/badge/shadcn/ui-000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Pragmatic Drag and Drop](https://img.shields.io/badge/Pragmatic%20Drag%20and%20Drop-2684FF?style=for-the-badge&logo=pragmaticdraganddrop&logoColor=white)](https://atlassian.design/components/pragmatic-drag-and-drop/)

[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[![pnpm](https://img.shields.io/badge/PNPM-F7E05F?style=for-the-badge&logo=pnpm&logoColor=black)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)](https://prettier.io/)
[![Husky](https://img.shields.io/badge/Husky-7C3AED?style=for-the-badge&logo=husky&logoColor=white)](https://typicode.github.io/husky/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

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
