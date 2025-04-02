import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { TodoService } from "./services/todoService";
import { ClientEvents, ServerEvents } from "./types";
import { query } from "./config/db";
import fs from "fs";
import path from "path";

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientEvents, ServerEvents>(httpServer, {
  cors: {
    origin: "http://localhost:3001", // Next.js app URL
    methods: ["GET", "POST"],
  },
});

const todoService = new TodoService();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const initDb = async () => {
  try {
    const schemaPath = path.join(__dirname, "config", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    await query(schema);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

// REST endpoints for initial data loading
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await todoService.getAllTodos();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("todo:create", async (input) => {
    try {
      const todo = await todoService.createTodo(input);
      io.emit("todo:created", todo);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  });

  socket.on("todo:update", async (todo) => {
    try {
      const updated = await todoService.updateTodo(todo.id, todo);
      if (updated) {
        io.emit("todo:updated", updated);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  });

  socket.on("todo:delete", async (todoId) => {
    try {
      if (await todoService.deleteTodo(todoId)) {
        io.emit("todo:deleted", todoId);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  });

  socket.on("todo:toggle", async (todoId) => {
    try {
      const todo = await todoService.toggleTodo(todoId);
      if (todo) {
        io.emit("todo:toggled", todoId, todo.completed);
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  });

  socket.on("todo:reorder", async (todoIds) => {
    try {
      const reorderedTodos = await todoService.updatePositions(todoIds);
      io.emit("todo:reordered", reorderedTodos);
    } catch (error) {
      console.error("Error reordering todos:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = process.env.PORT || 3002;

initDb().then(() => {
  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
