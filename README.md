# Todo Manager Application

A modern Todo Manager application built with Next.js, featuring a card-based view and a presentation mode.

## Features

- **Card View**: View all your todos in a clean card-based interface
- **Presentation Mode**: Present your active todos in a slideshow format
- **Add/Edit/Delete**: Full CRUD operations for todo items
- **Persistence**: Todos are saved in localStorage

## Technologies Used

- **Next.js 15**: React framework for building the application
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling
- **ShadCN UI**: Component library for UI elements
- **Lucide Icons**: Beautiful, consistent icons
- **Sonner**: Toast notifications

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. **Add Todo**: Click the "Add Todo" button to create a new todo
2. **Edit Todo**: Click the edit icon on any todo card to modify it
3. **Complete Todo**: Click the check icon to mark a todo as complete
4. **Delete Todo**: Click the trash icon to remove a todo
5. **Presentation Mode**: Navigate to the Presentation tab to view active todos as slides

## Project Structure

- `src/components`: UI components
- `src/context`: Application state management
- `src/types`: TypeScript type definitions
- `src/app`: Next.js pages and layouts

## Learn More

This project uses Next.js with App Router. To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [ShadCN UI](https://ui.shadcn.com/) - learn about the component library

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
