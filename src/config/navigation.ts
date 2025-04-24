import { navigationIcons } from './navigation-icons';

export type NavItem = {
  name: string;
  href: string;
  icon: keyof typeof navigationIcons;
  description?: string;
};

export const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'home',
    description: 'View your dashboard',
  },
  {
    name: 'Puglet Chronicles',
    href: 'https://puglet-chronicles.daryll.codes/',
    icon: 'storybook',
    description: 'Puglet Storybook',
  },
  {
    name: 'About',
    href: '/about',
    icon: 'about',
    description: 'Learn more about the project',
  },
  {
    name: 'Self-learning',
    href: '/study',
    icon: 'learning',
    description: 'React performance examples',
  },
];
