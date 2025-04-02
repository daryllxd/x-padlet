FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build TypeScript
# RUN pnpm build

# Expose the port the app runs on
EXPOSE 3002

# Start the application
CMD ["pnpm", "dev"] 
