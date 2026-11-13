import { ref, computed, inject, watch, type InjectionKey, type Ref, type ComputedRef } from 'vue';

export type SongLocale = 'zh' | 'en';

export interface SongLocaleInstance {
  current: Ref<SongLocale>;
  isEn: ComputedRef<boolean>;
  label: ComputedRef<string>;
  setLocale: (locale: SongLocale) => void;
  toggle: () => SongLocale;
}

export const SONG_LOCALE_KEY: InjectionKey<SongLocaleInstance> = Symbol('SongUILocale');

const STORAGE_KEY = 'song-ui-locale';

export function createSongLocale(initial: SongLocale = 'zh', persist = true): SongLocaleInstance {
  let start: SongLocale = initial;
  if (persist && typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh' || saved === 'en') {
      start = saved;
    }
  }

  const current = ref<SongLocale>(start);
  const isEn = computed(() => current.value === 'en');
  const label = computed(() => (current.value === 'en' ? 'English' : '简体中文'));

  function applyLocale(locale: SongLocale) {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', locale === 'en' ? 'en' : 'zh-CN');
    }
    if (persist && typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, locale);
    }
  }

  watch(current, (val) => applyLocale(val), { immediate: true });

  function setLocale(locale: SongLocale) {
    current.value = locale;
  }

  function toggle(): SongLocale {
    const next: SongLocale = current.value === 'zh' ? 'en' : 'zh';
    current.value = next;
    return next;
  }

  return { current, isEn, label, setLocale, toggle };
}

export function useLocale(): SongLocaleInstance {
  const injected = inject(SONG_LOCALE_KEY, null);
  return injected ?? createSongLocale('zh', false);
}
