# X-Padlet

Sample project to Upskill in:

[![Live Demo](https://img.shields.io/badge/🔋_Live_demo-Hello-green)](https://x-padlet.vercel.app)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/daryll-santos/)

## Features

- **Theming**: 🧑‍🎨 Customizable color schemes
- **Markdown Support**: 🙃Rich text editing with markdown syntax
- **Image Uploads**: 📋 Drag and drop image uploads with preview
  - 🐲 Pragmatic drag and drop [Reference](https://atlassian.design/components/pragmatic-drag-and-drop/examples/)
- **Real-time Updates**: 🔌 WebSocket integration for live updates (in progress)
- **Multiple Content Types**: 🥮 Support for different content types (in progress)
- **Persistence**: 🦸‍♂️ Server-side storage with real-time sync via Supabase

## Technologies Used

- **Next.js 15**: React framework for building the application
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling
- **ShadCN UI**: Component library for UI elements
- **Lucide Icons**: Beautiful, consistent icons
- **Sonner**: Toast notifications
- **Socket.IO**: Real-time WebSocket communication

## Getting Started

First, install the dependencies for both client and server:

```bash
# Install client dependencies
cd client
pnpm install
```

Then, start both the client and server:

```bash
$ pnpm run dev
$ pnpm run dev:https # Https version, but you need to edit your hosts file to access at https://x-padlet.local:3001/
```

To analyze the bundle size:

```bash
ANALYZE=true pnpm build
```

The application will be available at:

- Client: [http://localhost:3001](http://localhost:3001)

## Configuration

The application uses environment variables for configuration. Create a `.env.local` file in the root directory with the following variables:

```
# API URL - Change this to your production API URL when deploying
NEXT_PUBLIC_API_URL=http://localhost:3002
```

```bash
cp .env.local.example .env.local
```

## How to Use

1. **Create Content**: Click the "Create" button to add new content
2. **Edit Content**: Click the edit icon on any card to modify it
3. **Upload Images**: Drag and drop images or use the upload button
4. **Use Markdown**: Format your content using markdown syntax
5. **Change Theme**: Toggle between light and dark mode, or customize colors

## Project Structure

- `src/components`: UI components
- `src/context`: Application state management
- `src/types`: TypeScript type definitions
- `src/app`: Next.js pages and layouts
- `src/lib`: Utility functions and configuration
