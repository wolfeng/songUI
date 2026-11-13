import type { App, Plugin } from 'vue';
import { ensureSongSvgFilters } from './core/svg-filters.js';
import { createThemeController, SONG_THEME_KEY, type SongThemeName } from './composables/useTheme.js';
import { createSoundController, SONG_SOUND_KEY } from './composables/useSound.js';
import { createToastController, SONG_TOAST_KEY } from './composables/useToast.js';
import { createSongLocale, SONG_LOCALE_KEY, type SongLocale } from './composables/useLocale.js';

export interface SongUIOptions {
  /** 初始主题：暗夜洒金 ('dark') 或 澄心昼景 ('light') */
  theme?: SongThemeName;
  /** 是否将主题偏好持久化到 localStorage */
  persistTheme?: boolean;
  /** 初始语言：'zh' | 'en' */
  locale?: SongLocale;
  /** 是否将语言偏好持久化到 localStorage */
  persistLocale?: boolean;
  /** 是否启用宋代器物声学反馈 */
  sound?: boolean;
  /** 是否自动在页面挂载 SVG 宣纸/朱砂印章滤镜 */
  injectSvgFilters?: boolean;
}

export function createSongUI(options: SongUIOptions = {}): Plugin {
  const {
    theme = 'dark',
    persistTheme = true,
    locale = 'zh',
    persistLocale = true,
    sound = true,
    injectSvgFilters = true
  } = options;

  return {
    install(app: App) {
      const themeCtrl = createThemeController(theme, persistTheme);
      const localeCtrl = createSongLocale(locale, persistLocale);
      const soundCtrl = createSoundController(sound);
      const toastCtrl = createToastController();

      app.provide(SONG_THEME_KEY, themeCtrl);
      app.provide(SONG_LOCALE_KEY, localeCtrl);
      app.provide(SONG_SOUND_KEY, soundCtrl);
      app.provide(SONG_TOAST_KEY, toastCtrl);

      if (injectSvgFilters) {
        ensureSongSvgFilters();
      }
    }
  };
}
