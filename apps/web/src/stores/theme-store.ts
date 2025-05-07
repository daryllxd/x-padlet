import { TAILWIND_THEME_COLORS } from '@x-padlet/types';
import { create } from 'zustand';

type Theme = keyof typeof TAILWIND_THEME_COLORS;

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: 'white',
  setTheme: (theme) => {
    set({ theme });
    document.body.className = TAILWIND_THEME_COLORS[theme];
  },
}));
