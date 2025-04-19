import { TodoListTemplate, TemplateId } from '@/types/todo-list-template';

export const TODO_TEMPLATES: Record<TemplateId, TodoListTemplate> = {
  'bucket-list': {
    todoList: {
      title: 'My Bucket List',
      description: 'Things I want to do in my lifetime',
      display_mode: 'masonry',
    },
    todoGroups: [{ name: 'Adventures' }],
    todoItems: [
      {
        groupName: 'Adventures',
        items: [
          {
            title: 'Visit the Northern Lights',
            description: 'Experience the Aurora Borealis in person',
            is_completed: false,
          },
          {
            title: 'Learn a New Language',
            description: 'Become conversational in a foreign language',
            is_completed: false,
          },
          {
            title: 'Run a Marathon',
            description: 'Complete a full 26.2 mile race',
            is_completed: false,
          },
          {
            title: 'Start a Business',
            description: 'Turn a passion into a venture',
            is_completed: false,
          },
          {
            title: 'Learn to Surf',
            description: 'Catch your first wave',
            is_completed: false,
          },
          {
            title: 'Write a Book',
            description: 'Author your own story',
            is_completed: false,
          },
          {
            title: 'Travel Solo',
            description: 'Take a trip alone to a new country',
            is_completed: false,
          },
          {
            title: 'Learn to Play an Instrument',
            description: 'Master a musical instrument',
            is_completed: false,
          },
          {
            title: 'Go Skydiving',
            description: 'Experience freefall',
            is_completed: false,
          },
          {
            title: 'Plant a Garden',
            description: 'Grow your own food',
            is_completed: false,
          },
        ],
      },
    ],
    metadata: {
      id: 'bucket-list',
      name: 'Bucket List',
      description: 'Start your adventure with these inspiring bucket list items',
      itemSelectionStrategy: {
        type: 'random',
        count: 5,
      },
    },
  },

  groceries: {
    todoList: {
      title: 'Weekly Groceries',
      description: 'Shopping list for the week',
      display_mode: 'columnar',
    },
    todoGroups: [{ name: 'Essentials' }, { name: 'Nice to Have' }],
    todoItems: [
      {
        groupName: 'Essentials',
        items: [
          {
            title: 'Bread',
            description: 'Whole grain or sourdough',
            is_completed: false,
          },
          {
            title: 'Milk',
            description: '2% or whole milk',
            is_completed: false,
          },
          {
            title: 'Eggs',
            description: 'One dozen, free-range',
            is_completed: false,
          },
        ],
      },
      {
        groupName: 'Nice to Have',
        items: [
          {
            title: 'Dark Chocolate',
            description: '70% cocoa or higher',
            is_completed: false,
          },
          {
            title: 'Fresh Flowers',
            description: 'To brighten up the home',
            is_completed: false,
          },
          {
            title: 'Specialty Coffee',
            description: 'Try a new roast',
            is_completed: false,
          },
        ],
      },
    ],
    metadata: {
      id: 'groceries',
      name: 'Grocery List',
      description: 'Organize your shopping with essentials and nice-to-haves',
    },
  },
} as const;

/**
 * Helper function to get a template by ID with type safety
 */
export function getTemplate(id: TemplateId): TodoListTemplate {
  return TODO_TEMPLATES[id];
}
