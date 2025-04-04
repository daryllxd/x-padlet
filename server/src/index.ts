import cors from 'cors';
import express from 'express';
import fs from 'fs';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { query } from './config/db';
import { TodoListService } from './services/todoListService';
import { TodoService } from './services/todoService';
import { ClientEvents, ServerEvents } from './types';
import { WontFix } from './types/wontfix';
const allowedOrigins = ['http://localhost:3001', 'https://x-padlet.local:3001'];

const app = express();
const httpServer = createServer(app);

// Shared CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
};

const io = new Server<ClientEvents, ServerEvents>(httpServer, {
  cors: corsOptions,
});

const todoService = new TodoService();
const todoListService = new TodoListService();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize database
const initDb = async () => {
  try {
    const schemaPath = path.join(__dirname, 'config', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await query(schema);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// REST endpoints for initial data loading
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await todoService.getAllTodos(req.query.listId as string);
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todo lists:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.get('/api/todo-lists', async (req, res) => {
  try {
    const todoLists = await todoListService.getAllTodoLists();
    res.json(todoLists);
  } catch (error) {
    console.error('Error fetching todo lists:', error);
    res.status(500).json({ error: 'Failed to fetch todo lists' });
  }
});

// TODO: Figure out types in Express
app.post('/api/todo-lists', async (req, res): Promise<WontFix> => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTodoList = await todoListService.createTodoList({
      title,
      description,
    });

    res.status(201).json({
      id: newTodoList.id,
      title: newTodoList.title,
      description: newTodoList.description,
      todoCount: 0,
    });
  } catch (error) {
    console.error('Error creating todo list:', error);
    res.status(500).json({ error: 'Failed to create todo list' });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('todo:create', async (input) => {
    try {
      const todo = await todoService.createTodo(input);
      io.emit('todo:created', todo);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  });

  socket.on('todo:update', async (todo) => {
    try {
      const updated = await todoService.updateTodo(todo.id, todo);
      if (updated) {
        io.emit('todo:updated', updated);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  });

  socket.on('todo:delete', async (todoId) => {
    try {
      if (await todoService.deleteTodo(todoId)) {
        io.emit('todo:deleted', todoId);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  });

  socket.on('todo:toggle', async (todoId) => {
    try {
      const todo = await todoService.toggleTodo(todoId);
      if (todo) {
        io.emit('todo:toggled', todoId, todo.completed);
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  });

  socket.on('todo:reorder', async (todoIds) => {
    try {
      const reorderedTodos = await todoService.updatePositions(todoIds);
      io.emit('todo:reordered', reorderedTodos);
    } catch (error) {
      console.error('Error reordering todos:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 3002;

initDb().then(() => {
  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
