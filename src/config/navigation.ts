import { navigationIcons } from './navigation-icons';

export type NavItem = {
  name: string;
  href: string;
  icon: keyof typeof navigationIcons;
  description?: string;
};

export const navigationItems: NavItem[] = [
  {
    name: 'My work',
    href: '/',
    icon: 'home',
    description: 'View your work dashboard',
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
