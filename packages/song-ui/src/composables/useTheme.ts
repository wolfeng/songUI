import { inject, ref, computed, watch, type InjectionKey, type Ref, type ComputedRef } from 'vue';

export type SongThemeName = 'dark' | 'light';

export interface SongThemeInstance {
  current: Ref<SongThemeName>;
  isDark: ComputedRef<boolean>;
  label: ComputedRef<string>;
  setTheme: (name: SongThemeName) => void;
  toggle: () => SongThemeName;
}

export const SONG_THEME_KEY: InjectionKey<SongThemeInstance> = Symbol('SongUITheme');

const STORAGE_KEY = 'song-ui-theme';

export function createThemeController(defaultTheme: SongThemeName = 'dark', persist = true): SongThemeInstance {
  let initial: SongThemeName = defaultTheme;
  if (persist && typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      initial = saved;
    }
  }

  const current = ref<SongThemeName>(initial);
  const isDark = computed(() => current.value === 'dark');
  const label = computed(() => (current.value === 'dark' ? '暗夜洒金' : '澄心昼景'));

  function applyDomTheme(theme: SongThemeName) {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    if (persist && typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }

  watch(current, (next) => applyDomTheme(next), { immediate: true });

  function setTheme(name: SongThemeName) {
    current.value = name;
  }

  function toggle(): SongThemeName {
    const next: SongThemeName = current.value === 'dark' ? 'light' : 'dark';
    current.value = next;
    return next;
  }

  return { current, isDark, label, setTheme, toggle };
}

export function useTheme(): SongThemeInstance {
  const theme = inject(SONG_THEME_KEY, null);
  if (!theme) {
    return createThemeController('dark', false);
  }
  return theme;
}
