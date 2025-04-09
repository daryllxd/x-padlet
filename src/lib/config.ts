// API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Construct API endpoints
export const API_ENDPOINTS = {
  todoLists: `/api/todo-lists`,
  todoList: (id: string) => `/api/todo-lists/${id}`,
  todos: (listId: string) => `${API_URL}/api/todos?listId=${listId}`,
};
