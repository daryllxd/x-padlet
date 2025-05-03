import type { Meta, StoryObj } from '@storybook/react';
import { TodoItem } from '@x-padlet/types';
import { StreamTodoList } from './stream-todo-list';

const meta = {
  title: 'Todo Lists/StreamTodoList',
  component: StreamTodoList,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    todos: {
      control: 'object',
      description: 'Array of todo items to display',
    },
    listId: {
      control: 'text',
      description: 'The ID of the todo list',
    },
  },
} satisfies Meta<typeof StreamTodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

const generateTodos = (count: number): TodoItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `todo-${i + 1}`,
    title: `Todo Item ${i + 1}`,
    description: `This is a description for todo item ${i + 1}`,
    is_completed: false,
    theme: 'blue',
    image_url: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    position: i + 1,
    todo_list_id: 'list-1',
    todo_group_id: 'group-1',
    todo_group_name: 'Default Group',
    position_in_group: i + 1,
    todo_group_position: 1,
  }));
};

export const Default: Story = {
  args: {
    todos: generateTodos(5).map((todo, index) => ({
      ...todo,
      theme: ['blue', 'green', 'purple', 'yellow', 'red'][index % 5] as TodoItem['theme'],
    })),
    listId: 'list-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'StreamTodoList with todos using different theme colors',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    todos: [],
    listId: 'list-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'StreamTodoList with no todos',
      },
    },
  },
};

export const SingleTodo: Story = {
  args: {
    todos: generateTodos(1),
    listId: 'list-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'StreamTodoList with a single todo item',
      },
    },
  },
};
