import { TodoList } from '@/types/todo';
import { useQuery } from '@tanstack/react-query';

const fetchTodoLists = async (): Promise<TodoList[]> => {
  const response = await fetch('http://localhost:3002/api/todo-lists');
  if (!response.ok) {
    throw new Error('Failed to fetch todo lists');
  }
  return response.json();
};

// Default data for initial rendering
const defaultTodoLists: TodoList[] = [
  {
    id: '1',
    title: 'Getting Started',
    description: 'A list of tasks to help you get started with the app',
    todoCount: 3,
    status: 'active',
  },
  {
    id: '2',
    title: 'Work Projects',
    description: 'Track your work projects and deadlines',
    todoCount: 0,
    status: 'active',
  },
  {
    id: '3',
    title: 'Personal Goals',
    description: 'Keep track of your personal goals and achievements',
    todoCount: 0,
    status: 'active',
  },
];

export function useTodoLists() {
  return useQuery({
    queryKey: ['todoLists'],
    queryFn: fetchTodoLists,
    initialData: defaultTodoLists,
  });
}

export function useTodoList(listId: string) {
  return useQuery({
    queryKey: ['todoLists'],
    queryFn: fetchTodoLists,
    select: (data) => data.find((list) => list.id === listId),
    enabled: !!listId,
    initialData: defaultTodoLists,
  });
}
