export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  position: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTodoInput {
  title: string;
  description: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  position?: number;
}

// Client -> Server events
export interface ClientEvents {
  "todo:create": (todo: CreateTodoInput) => void;
  "todo:update": (todo: Todo) => void;
  "todo:delete": (todoId: string) => void;
  "todo:toggle": (todoId: string) => void;
  "todo:reorder": (todoIds: string[]) => void;
}

// Server -> Client events
export interface ServerEvents {
  "todo:created": (todo: Todo) => void;
  "todo:updated": (todo: Todo) => void;
  "todo:deleted": (todoId: string) => void;
  "todo:toggled": (todoId: string, completed: boolean) => void;
  "todo:reordered": (todos: Todo[]) => void;
}
