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
    Object.values(TAILWIND_THEME_COLORS).forEach((cls) => {
      document.body.classList.remove(cls);
    });
    document.body.classList.add(TAILWIND_THEME_COLORS[theme]);
  },
}));
