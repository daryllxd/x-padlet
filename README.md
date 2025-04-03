# X-Padlet

Sample project to Upskill in:

- 🔌 Websockets via Socket.io
- 🐲 Pragmatic drag and drop [Reference](https://atlassian.design/components/pragmatic-drag-and-drop/examples/)
- 📋 Clipboard API and rendering different content from the clipboard
- 🎨 More theming experiments
- 🚢 Containerization/Deployment/Docker

## Features

- **Card View**: View all your todos in a clean card-based interface
- **Presentation Mode**: Present your active todos in a slideshow format
- **Add/Edit/Delete**: Full CRUD operations for todo items
- **Real-time Updates**: WebSocket integration for live updates
- **Persistence**: Server-side storage with real-time sync

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

# Install server dependencies
cd server
pnpm install
```

Then, start both the client and server:

```bash
$ pnpm run dev
$ pnpm run dev:https # Https version, but you need to edit your hosts file to access at https://x-padlet.local:3001/

$ pnpm run server # Need to create DB
```

The application will be available at:

- Client: [http://localhost:3000](http://localhost:3000)
- Server: [http://localhost:3001](http://localhost:3001)

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
