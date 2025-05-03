# 🐶 Puglet

One of the todo list applications of all time

![Preview](/apps/web/public/preview-view-list.png)

[![Live Demo](https://img.shields.io/badge/🙏_%20%20%20Live_demo-puglet.daryll.codes-green)](https://puglet.daryll.codes)
[![Demo on Vercel](https://img.shields.io/badge/Deployed_on_vercel-padlet.vercel.app-green?logo=vercel)](https://x-padlet.vercel.app)

[![Storybook](https://img.shields.io/badge/Puglet_chronicles-online-purple?logo=storybook&style=popout)](https://puglet-chronicles.daryll.codes) [![Cloudflare Pages Storybook](https://img.shields.io/badge/Deployed_on_Cloudflare_pages-online-purple?logo=storybook&style=popout)](https://x-padlet.pages.dev)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/daryll-santos/)

## What's it do?

I wanted to create a side project that would keep track of things + to learn and re-learn some front-end concepts!

## Tech Stack

[![Next.js](https://img.shields.io/badge/NextJS-000000?style=popout&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=popout&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=popout&logo=react-query&logoColor=white)](https://tanstack.com/query/latest)
[![Shadcn UI](https://img.shields.io/badge/shadcn/ui-000?style=popout&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=popout&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Pragmatic Drag and Drop](https://img.shields.io/badge/Pragmatic%20Drag%20and%20Drop-2684FF?style=popout&logo=pragmaticdraganddrop&logoColor=white)](https://atlassian.design/components/pragmatic-drag-and-drop/)
[![MSW](https://img.shields.io/badge/MSW-F0DB4F?style=popout&logo=javascript&logoColor=black)](https://mswjs.io/)

[![AWS](https://img.shields.io/badge/AWS-232F3E?style=popout&logo=amazonwebservices&logoColor=white)](https://aws.amazon.com/)
[![S3](https://img.shields.io/badge/S3-569A31?style=popout&logo=amazonaws&logoColor=white)](https://aws.amazon.com/s3/)
[![Cloudfront](https://img.shields.io/badge/Cloudfront-F79825?style=popout&logo=amazonaws&logoColor=white)](https://aws.amazon.com/cloudfront/)
[![Namecheap](https://img.shields.io/badge/Namecheap-00B14F?style=popout&logoColor=white)](https://www.namecheap.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=popout&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=popout&logo=supabase&logoColor=white)](https://supabase.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=popout&logo=redis&logoColor=white)](https://redis.io/)

[![pnpm](https://img.shields.io/badge/PNPM-F7E05F?style=popout&logo=pnpm&logoColor=black)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=popout&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=popout&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=popout&logo=prettier&logoColor=black)](https://prettier.io/)
[![Husky](https://img.shields.io/badge/Husky-7C3AED?style=popout&logo=husky&logoColor=white)](https://typicode.github.io/husky/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=popout&logo=docker&logoColor=white)](https://www.docker.com/)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=popout&logo=storybook&logoColor=white)](https://storybook.js.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-452FAD?style=popout&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)

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

## Monorepo Commands

This project uses Turborepo for monorepo management. Here are the essential commands:

### Package Management

```bash
# Add a package to web app
pnpm add <package> --filter @x-padlet/web

# Add a dev dependency to web app
pnpm add -D <package> --filter @x-padlet/web

# Install all dependencies (from root)
pnpm install

# Install dependencies for web app only
pnpm install --filter @x-padlet/web

# Update all dependencies
pnpm update

# Update specific package
pnpm update <package> --filter @x-padlet/web
```

### Development

```bash
# Run dev server for web app
pnpm dev

# Run storybook
pnpm storybook

# Run both dev and storybook in parallel
pnpm dev & pnpm storybook
```

### Building

```bash
# Build all packages
pnpm build

# Build web app only
pnpm build --filter @x-padlet/web

# Starting
pnpm --filter @x-padlet/web start

# Generate build dependency graph
npx turbo run build --graph=graph.pdf
```

### Linting and Formatting

```bash
# Lint all packages
pnpm lint

# Lint web app only
pnpm lint --filter @x-padlet/web

# Format all packages
pnpm format

# Format web app only
pnpm format --filter @x-padlet/web
```

### Testing

```bash
# Run tests for all packages
pnpm test

# Run tests for web app only
pnpm test --filter @x-padlet/web
```

### Cleaning

```bash
# Clean all packages
pnpm clean

# Clean web app only
pnpm clean --filter @x-padlet/web
```

### Helpful Commands

```bash
# List all packages
pnpm list -r

# Check for unused dependencies
pnpm knip
```

### Vercel deployment

- "Root directory is at https://vercel.com/daryllxds-projects/x-padlet/settings/build-and-deployment - should be apps/web, we cannot really change this in vercel.json"

<div style="text-align: center;">
  <img src="apps/web/public/wow-pug.png" alt="Poggers" height="200" width="200" style="border-radius: 50%;">
  <p>This is Poggers the Pug</p>
</div>
