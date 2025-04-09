export const API_ENDPOINTS = {
  todoLists: `/api/todo-lists`,
  todoList: (id: string) => `/api/todo-lists/${id}`,
  todos: (listId: string) => `/api/todos?listId=${listId}`,
};
