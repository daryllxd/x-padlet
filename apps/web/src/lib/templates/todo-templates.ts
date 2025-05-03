import { TemplateId, TodoListTemplate } from '@x-padlet/types';

const positiveAdjectives = [
  'Amazing',
  'Awesome',
  'Beautiful',
  'Bright',
  'Brilliant',
  'Cheerful',
  'Creative',
  // ... (all the adjectives you provided)
] as const;

function getRandomAdjective() {
  return positiveAdjectives[Math.floor(Math.random() * positiveAdjectives.length)];
}

export const TODO_TEMPLATES: Record<TemplateId, TodoListTemplate> = {
  blank: {
    todoList: {
      title: `✨ My ${getRandomAdjective()} Puglet`,
      description: 'A fresh start for your ideas',
      display_mode: 'masonry',
    },
    todoGroups: [{ name: 'Tasks' }],
    todoItems: [
      {
        groupName: 'Tasks',
        items: [
          {
            title: 'Add your first task',
            description: 'Click the + button to add a new task',
            is_completed: false,
          },
        ],
      },
    ],
    metadata: {
      id: 'blank',
      name: '✨ Blank List',
      description: 'Start fresh with a clean slate',
    },
  },
  'bucket-list': {
    todoList: {
      title: '🌟 My Bucket List',
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
      name: '🌟 Bucket List',
      description: 'Start your adventure with these inspiring bucket list items',
      itemSelectionStrategy: {
        type: 'random',
        count: 5,
      },
    },
  },

  groceries: {
    todoList: {
      title: '🛒 Weekly Groceries',
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
      name: '🛒 Grocery List',
      description: 'Organize your shopping with essentials and nice-to-haves',
    },
  },
  'book-list': {
    todoList: {
      title: '📚 Reading List',
      description: 'Books to read and remember',
      display_mode: 'masonry',
    },
    todoGroups: [{ name: 'Reading List' }],
    todoItems: [
      {
        groupName: 'Reading List',
        items: [
          {
            title: 'The Midnight Library',
            description: 'By Matt Haig - A story about infinite possibilities',
            is_completed: false,
          },
          {
            title: 'Project Hail Mary',
            description: 'By Andy Weir - A tale of survival and science',
            is_completed: false,
          },
          {
            title: 'Atomic Habits',
            description: 'By James Clear - Small changes, remarkable results',
            is_completed: false,
          },
          {
            title: 'The Thursday Murder Club',
            description: 'By Richard Osman - Mystery solved by retirees',
            is_completed: false,
          },
          {
            title: 'Klara and the Sun',
            description: 'By Kazuo Ishiguro - AI and human connection',
            is_completed: false,
          },
        ],
      },
    ],
    metadata: {
      id: 'book-list',
      name: '📚 Book List',
      description: 'Track your reading journey with this curated list',
    },
  },
  'travel-checklist': {
    todoList: {
      title: '✈️ Travel Checklist',
      description: 'Everything you need for your journey',
      display_mode: 'columnar',
    },
    todoGroups: [
      { name: '🧳 Essentials' },
      { name: '📱 Electronics' },
      { name: '🏥 Health & Safety' },
      { name: '📄 Documents' },
    ],
    todoItems: [
      {
        groupName: '🧳 Essentials',
        items: [
          {
            title: 'Passport & ID',
            description: 'Check expiration dates',
            is_completed: false,
          },
          {
            title: 'Weather-appropriate clothing',
            description: 'Check destination forecast',
            is_completed: false,
          },
          {
            title: 'Travel pillow & blanket',
            description: 'For comfortable transit',
            is_completed: false,
          },
          {
            title: 'Universal adapter',
            description: 'Check destination socket type',
            is_completed: false,
          },
        ],
      },
      {
        groupName: '📱 Electronics',
        items: [
          {
            title: 'Phone & charger',
            description: 'Include portable battery pack',
            is_completed: false,
          },
          {
            title: 'Camera',
            description: 'Check memory cards and batteries',
            is_completed: false,
          },
          {
            title: 'Laptop & charger',
            description: 'If needed for work',
            is_completed: false,
          },
        ],
      },
      {
        groupName: '🏥 Health & Safety',
        items: [
          {
            title: 'Travel insurance',
            description: 'Take photos of documents',
            is_completed: false,
          },
          {
            title: 'First aid kit',
            description: 'Include any prescription medications',
            is_completed: false,
          },
          {
            title: 'Face masks & sanitizer',
            description: 'Travel-sized bottles',
            is_completed: false,
          },
        ],
      },
      {
        groupName: '📄 Documents',
        items: [
          {
            title: 'Booking confirmations',
            description: 'Flights, hotels, activities',
            is_completed: false,
          },
          {
            title: 'Travel insurance docs',
            description: 'Digital and physical copies',
            is_completed: false,
          },
          {
            title: 'Emergency contacts',
            description: 'Local embassy, insurance hotline',
            is_completed: false,
          },
        ],
      },
    ],
    metadata: {
      id: 'travel-checklist',
      name: '✈️ Travel Checklist',
      description: 'Never forget essential items with this comprehensive travel checklist',
    },
  },
} as const;

/**
 * Helper function to get a template by ID with type safety
 */
export function getTemplate(id: TemplateId): TodoListTemplate {
  return TODO_TEMPLATES[id];
}
