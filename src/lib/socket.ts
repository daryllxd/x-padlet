import { io } from "socket.io-client";
import { TodoItem } from "@/types";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export const socket = io(SOCKET_URL);

// Event listeners for todos
export const socketEvents = {
  onTodoCreated: (callback: (todo: TodoItem) => void) => {
    socket.on("todo:created", callback);
  },
  onTodoUpdated: (callback: (todo: TodoItem) => void) => {
    socket.on("todo:updated", callback);
  },
  onTodoDeleted: (callback: (todoId: string) => void) => {
    socket.on("todo:deleted", callback);
  },
  onTodoToggled: (callback: (todoId: string, completed: boolean) => void) => {
    socket.on("todo:toggled", callback);
  },
  onTodoReordered: (callback: (todos: TodoItem[]) => void) => {
    socket.on("todo:reordered", callback);
  },
  // Event emitters
  createTodo: (todo: Omit<TodoItem, "id" | "created_at" | "updated_at">) => {
    socket.emit("todo:create", todo);
  },
  updateTodo: (todo: TodoItem) => {
    socket.emit("todo:update", todo);
  },
  deleteTodo: (todoId: string) => {
    socket.emit("todo:delete", todoId);
  },
  toggleTodo: (todoId: string) => {
    socket.emit("todo:toggle", todoId);
  },
  reorderTodos: (todoIds: string[]) => {
    socket.emit("todo:reorder", todoIds);
  },
};
