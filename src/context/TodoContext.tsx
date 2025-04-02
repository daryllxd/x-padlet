"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { TodoItem } from "@/types";
import { socketEvents } from "@/lib/socket";

interface TodoContextType {
  todos: TodoItem[];
  addTodo: (todo: Omit<TodoItem, "id" | "created_at" | "updated_at">) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    // Set up socket event listeners
    socketEvents.onTodoCreated((todo) => {
      setTodos((prev) => [...prev, todo]);
    });

    socketEvents.onTodoUpdated((updatedTodo) => {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
    });

    socketEvents.onTodoDeleted((todoId) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
    });

    socketEvents.onTodoToggled((todoId, completed) => {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === todoId ? { ...todo, completed } : todo))
      );
    });

    // Fetch initial todos
    fetch("http://localhost:3002/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));

    // Cleanup socket listeners on unmount
    return () => {
      // Socket.io automatically removes listeners when the component unmounts
    };
  }, []);

  const addTodo = (
    todo: Omit<TodoItem, "id" | "created_at" | "updated_at">
  ) => {
    socketEvents.createTodo(todo);
  };

  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      socketEvents.updateTodo({ ...todo, ...updates });
    }
  };

  const deleteTodo = (id: string) => {
    socketEvents.deleteTodo(id);
  };

  const toggleComplete = (id: string) => {
    socketEvents.toggleTodo(id);
  };

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}
