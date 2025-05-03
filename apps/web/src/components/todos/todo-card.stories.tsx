import type { Meta, StoryObj } from '@storybook/react';
import { TodoItem } from '@x-padlet/types';
import { TodoCard } from './todo-card';

const meta = {
  title: 'Todos/TodoCard',
  component: TodoCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    todo: {
      control: 'object',
      description: 'The todo item to display',
    },
    listId: {
      control: 'text',
      description: 'The ID of the todo list this card belongs to',
    },
  },
} satisfies Meta<typeof TodoCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultTodo: TodoItem = {
  id: '1',
  title: 'Complete Project Documentation',
  description:
    'Write comprehensive documentation for the project including setup instructions, API endpoints, and usage examples.',
  is_completed: false,
  theme: 'blue',
  image_url: undefined,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  position: 1,
  todo_list_id: 'list-1',
  todo_group_id: 'group-1',
  todo_group_name: 'Default Group',
  position_in_group: 1,
  todo_group_position: 1,
};

export const Default: Story = {
  args: {
    todo: defaultTodo,
    listId: 'list-1',
  },
};

export const WithPhoto: Story = {
  args: {
    todo: {
      ...defaultTodo,
      image_url: '/puglet.png',
    },
    listId: 'list-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'A todo card with an image attached',
      },
    },
  },
};

export const NoTitle: Story = {
  args: {
    todo: {
      ...defaultTodo,
      title: '',
    },
    listId: 'list-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'A todo card without a title',
      },
    },
  },
};

export const NoDescription: Story = {
  args: {
    todo: {
      ...defaultTodo,
      description: '',
    },
    listId: 'list-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'A todo card without a description',
      },
    },
  },
};

export const Completed: Story = {
  args: {
    todo: {
      ...defaultTodo,
      is_completed: true,
    },
    listId: 'list-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'A completed todo card',
      },
    },
  },
};

export const WithFullPhoto: Story = {
  args: {
    todo: {
      ...defaultTodo,
      image_url: '/puglet-full.png',
    },
    listId: 'list-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'A todo card with a full-width image',
      },
    },
  },
};

export const DifferentTheme: Story = {
  args: {
    todo: {
      ...defaultTodo,
      theme: 'green',
    },
    listId: 'list-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'A todo card with a different theme color',
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    todo: {
      ...defaultTodo,
      title:
        'This is a very long title that should wrap to multiple lines if the container is not wide enough',
      description: `# This is a markdown description

## With multiple sections

- Bullet point 1
- Bullet point 2
- Bullet point 3

\`\`\`javascript
const code = "block";
\`\`\`

And some **bold** and *italic* text.`,
    },
    listId: 'list-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'A todo card with long content and markdown formatting',
      },
    },
  },
};
