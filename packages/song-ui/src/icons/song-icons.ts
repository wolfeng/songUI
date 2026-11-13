export type SongIconCategory = 'stationery' | 'crafts' | 'astronomy' | 'ui';

export interface SongIconShape {
  tag: 'path' | 'circle' | 'rect' | 'line' | 'polygon';
  attrs: Record<string, string | number>;
}

export interface SongIconDef {
  zh: string;
  en: string;
  category: SongIconCategory;
  shapes: SongIconShape[];
}

export const SONG_ICON_DEFS = {
  // 一、文房雅集 (Stationery & Classics)
  scroll: {
    zh: '古卷',
    en: 'Scroll',
    category: 'stationery',
    shapes: [
      { tag: 'path', attrs: { d: 'M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6' } },
      { tag: 'rect', attrs: { x: 4, y: 3, width: 3, height: 18, rx: 1.5 } },
      { tag: 'line', attrs: { x1: 10, y1: 8, x2: 16, y2: 8 } },
      { tag: 'line', attrs: { x1: 10, y1: 12, x2: 16, y2: 12 } },
      { tag: 'line', attrs: { x1: 10, y1: 16, x2: 14, y2: 16 } }
    ]
  },
  brush: {
    zh: '湖笔',
    en: 'Brush',
    category: 'stationery',
    shapes: [
      { tag: 'path', attrs: { d: 'M18.5 3.5a2.1 2.1 0 0 1 2 2L11 15l-3-3 10.5-8.5Z' } },
      { tag: 'path', attrs: { d: 'M8 12c-2.2.6-3.4 2.2-3.7 4.5-.2 1.4-1.3 2.5-1.3 2.5s2.5.4 4.2-.6c1.5-.9 2.3-2.2 2.8-3.4' } }
    ]
  },
  inkstone: {
    zh: '端砚',
    en: 'Inkstone',
    category: 'stationery',
    shapes: [
      { tag: 'rect', attrs: { x: 4, y: 4, width: 16, height: 16, rx: 2.5 } },
      { tag: 'path', attrs: { d: 'M7.5 8h9v4.5a4.5 4.5 0 0 1-9 0V8Z' } },
      { tag: 'line', attrs: { x1: 8, y1: 17.5, x2: 16, y2: 17.5 } }
    ]
  },
  seal: {
    zh: '朱印',
    en: 'Seal',
    category: 'stationery',
    shapes: [
      { tag: 'rect', attrs: { x: 5, y: 5, width: 14, height: 14, rx: 2 } },
      { tag: 'path', attrs: { d: 'M9 9h6M12 9v6M9.5 15h5' } }
    ]
  },
  book: {
    zh: '善本',
    en: 'Woodblock Book',
    category: 'stationery',
    shapes: [
      { tag: 'path', attrs: { d: 'M5 4h13a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 18 20H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z' } },
      { tag: 'line', attrs: { x1: 8, y1: 4, x2: 8, y2: 20 } },
      { tag: 'line', attrs: { x1: 4, y1: 9, x2: 8, y2: 9 } },
      { tag: 'line', attrs: { x1: 4, y1: 15, x2: 8, y2: 15 } },
      { tag: 'rect', attrs: { x: 11.5, y: 7, width: 4.5, height: 7, rx: 0.5 } }
    ]
  },
  bookmark: {
    zh: '牙签',
    en: 'Ivory Tag',
    category: 'stationery',
    shapes: [
      { tag: 'path', attrs: { d: 'M7 3.5h10a1 1 0 0 1 1 1v16l-6-3.8-6 3.8v-16a1 1 0 0 1 1-1Z' } },
      { tag: 'line', attrs: { x1: 10, y1: 8, x2: 14, y2: 8 } },
      { tag: 'line', attrs: { x1: 12, y1: 8, x2: 12, y2: 13 } }
    ]
  },
  feather: {
    zh: '题笺',
    en: 'Folio Note',
    category: 'stationery',
    shapes: [
      { tag: 'path', attrs: { d: 'M19.5 4.5c-5.5 0-10.5 3.8-12 9.5l-2 5.5 5.5-2c5.7-1.5 9.5-6.5 9.5-12a1 1 0 0 0-1-1Z' } },
      { tag: 'path', attrs: { d: 'M6 18 14 10' } }
    ]
  },

  // 二、器物百工 (Ceramics & Crafts)
  celadon: {
    zh: '青瓷',
    en: 'Celadon Vase',
    category: 'crafts',
    shapes: [
      { tag: 'path', attrs: { d: 'M9.5 3.5h5l-.8 3.2c2.4 1.6 3.8 4 3.8 6.8 0 3.4-2.2 6-5.5 7-3.3-1-5.5-3.6-5.5-7 0-2.8 1.4-5.2 3.8-6.8l-.8-3.2Z' } },
      { tag: 'line', attrs: { x1: 8.5, y1: 20.5, x2: 15.5, y2: 20.5 } }
    ]
  },
  jianbowl: {
    zh: '建盏',
    en: 'Jian Bowl',
    category: 'crafts',
    shapes: [
      { tag: 'path', attrs: { d: 'M3.5 8.5h17c-.5 5.5-3.8 9-8.5 9s-8-3.5-8.5-9Z' } },
      { tag: 'path', attrs: { d: 'M7 11.5c1.5.8 3.5 1 5 1s3.5-.2 5-1' } },
      { tag: 'path', attrs: { d: 'M9 17.5v2h6v-2' } }
    ]
  },
  chaxian: {
    zh: '茶筅',
    en: 'Bamboo Whisk',
    category: 'crafts',
    shapes: [
      { tag: 'rect', attrs: { x: 10.5, y: 3, width: 3, height: 6, rx: 1 } },
      { tag: 'path', attrs: { d: 'M10.5 9C8 12 7 15.5 7.5 19c1.4 1 3 1.5 4.5 1.5s3.1-.5 4.5-1.5c.5-3.5-.5-7-3-10' } },
      { tag: 'line', attrs: { x1: 12, y1: 9, x2: 12, y2: 20 } },
      { tag: 'path', attrs: { d: 'M10.5 10c-1 3.5-1.2 6.8-.8 9.5M13.5 10c1 3.5 1.2 6.8.8 9.5' } }
    ]
  },
  censer: {
    zh: '香炉',
    en: 'Incense Censer',
    category: 'crafts',
    shapes: [
      { tag: 'path', attrs: { d: 'M6 11h12v2.5a6 6 0 0 1-12 0V11Z' } },
      { tag: 'path', attrs: { d: 'M6 12c-1.5 0-2-.8-2-1.5S4.5 9 6 9h12c1.5 0 2 .8 2 1.5s-.5 1.5-2 1.5' } },
      { tag: 'path', attrs: { d: 'M8 18.5 7 21M16 18.5l1 2.5M12 19.5V21' } },
      { tag: 'path', attrs: { d: 'M10.5 7c0-1.5 1.5-2 1.5-3.5M13.5 7.5c0-1.2 1.2-1.6 1.2-2.8' } }
    ]
  },
  guqin: {
    zh: '古琴',
    en: 'Guqin',
    category: 'crafts',
    shapes: [
      { tag: 'path', attrs: { d: 'M6 6.5c1.5-2 3.2-2.5 6-2.5s4.5.5 6 2.5l-1 13c-.2.8-1 1.5-2 1.5H9c-1 0-1.8-.7-2-1.5l-1-13Z' } },
      { tag: 'line', attrs: { x1: 10.5, y1: 5, x2: 10.5, y2: 20 } },
      { tag: 'line', attrs: { x1: 12, y1: 5, x2: 12, y2: 20 } },
      { tag: 'line', attrs: { x1: 13.5, y1: 5, x2: 13.5, y2: 20 } }
    ]
  },
  lantern: {
    zh: '宫灯',
    en: 'Palace Lantern',
    category: 'crafts',
    shapes: [
      { tag: 'line', attrs: { x1: 12, y1: 2.5, x2: 12, y2: 5 } },
      { tag: 'path', attrs: { d: 'M8 5h8l2 4.5-2 6.5H8L6 9.5 8 5Z' } },
      { tag: 'line', attrs: { x1: 12, y1: 5, x2: 12, y2: 16 } },
      { tag: 'path', attrs: { d: 'M10 16v3.5M12 16v4.5M14 16v3.5' } }
    ]
  },
  pavilion: {
    zh: '飞檐亭',
    en: 'Song Pavilion',
    category: 'crafts',
    shapes: [
      { tag: 'path', attrs: { d: 'M3 10.5C6.5 9 9.5 6.5 12 4c2.5 2.5 5.5 5 9 6.5H3Z' } },
      { tag: 'line', attrs: { x1: 6.5, y1: 10.5, x2: 6.5, y2: 18.5 } },
      { tag: 'line', attrs: { x1: 17.5, y1: 10.5, x2: 17.5, y2: 18.5 } },
      { tag: 'line', attrs: { x1: 12, y1: 10.5, x2: 12, y2: 18.5 } },
      { tag: 'line', attrs: { x1: 4, y1: 19, x2: 20, y2: 19 } }
    ]
  },

  // 三、天文历法 (Astronomy & Time)
  compass: {
    zh: '司南',
    en: 'Sinan Compass',
    category: 'astronomy',
    shapes: [
      { tag: 'circle', attrs: { cx: 12, cy: 12, r: 8.5 } },
      { tag: 'polygon', attrs: { points: '12,6.5 14.2,12 12,17.5 9.8,12' } },
      { tag: 'circle', attrs: { cx: 12, cy: 12, r: 1 } }
    ]
  },
  sundial: {
    zh: '日晷',
    en: 'Sundial',
    category: 'astronomy',
    shapes: [
      { tag: 'circle', attrs: { cx: 12, cy: 12, r: 8.5 } },
      { tag: 'line', attrs: { x1: 12, y1: 12, x2: 16.5, y2: 7.5 } },
      { tag: 'line', attrs: { x1: 12, y1: 3.5, x2: 12, y2: 5.5 } },
      { tag: 'line', attrs: { x1: 20.5, y1: 12, x2: 18.5, y2: 12 } },
      { tag: 'line', attrs: { x1: 12, y1: 20.5, x2: 12, y2: 18.5 } },
      { tag: 'line', attrs: { x1: 3.5, y1: 12, x2: 5.5, y2: 12 } }
    ]
  },
  clepsydra: {
    zh: '刻漏',
    en: 'Clepsydra',
    category: 'astronomy',
    shapes: [
      { tag: 'path', attrs: { d: 'M7 4h10l-1.5 6h-7L7 4Z' } },
      { tag: 'path', attrs: { d: 'M8 14h8v5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-5Z' } },
      { tag: 'line', attrs: { x1: 12, y1: 10, x2: 12, y2: 14 } },
      { tag: 'line', attrs: { x1: 8, y1: 17.5, x2: 16, y2: 17.5 } }
    ]
  },
  calendar: {
    zh: '宋历',
    en: 'Almanac Calendar',
    category: 'astronomy',
    shapes: [
      { tag: 'rect', attrs: { x: 4, y: 5, width: 16, height: 15, rx: 2 } },
      { tag: 'line', attrs: { x1: 8, y1: 3, x2: 8, y2: 6.5 } },
      { tag: 'line', attrs: { x1: 16, y1: 3, x2: 16, y2: 6.5 } },
      { tag: 'line', attrs: { x1: 4, y1: 9.5, x2: 20, y2: 9.5 } },
      { tag: 'circle', attrs: { cx: 12, cy: 14.5, r: 1.5 } }
    ]
  },
  clock: {
    zh: '时辰',
    en: 'Shichen Clock',
    category: 'astronomy',
    shapes: [
      { tag: 'circle', attrs: { cx: 12, cy: 12, r: 8.5 } },
      { tag: 'path', attrs: { d: 'M12 7.5V12l3.2 2' } }
    ]
  },
  sun: {
    zh: '白昼',
    en: 'Daylight',
    category: 'astronomy',
    shapes: [
      { tag: 'circle', attrs: { cx: 12, cy: 12, r: 4 } },
      { tag: 'path', attrs: { d: 'M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' } }
    ]
  },
  moon: {
    zh: '夜读',
    en: 'Night Watch',
    category: 'astronomy',
    shapes: [
      { tag: 'path', attrs: { d: 'M19 14.5A7 7 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z' } }
    ]
  },

  // 四、界面通用 (UI & Navigation)
  search: {
    zh: '寻幽',
    en: 'Search',
    category: 'ui',
    shapes: [
      { tag: 'circle', attrs: { cx: 10.5, cy: 10.5, r: 6 } },
      { tag: 'line', attrs: { x1: 15, y1: 15, x2: 20, y2: 20 } }
    ]
  },
  close: {
    zh: '收卷',
    en: 'Close',
    category: 'ui',
    shapes: [
      { tag: 'line', attrs: { x1: 6, y1: 6, x2: 18, y2: 18 } },
      { tag: 'line', attrs: { x1: 18, y1: 6, x2: 6, y2: 18 } }
    ]
  },
  check: {
    zh: '批复',
    en: 'Check',
    category: 'ui',
    shapes: [
      { tag: 'path', attrs: { d: 'M5 12.5 9.5 17 19 7' } }
    ]
  },
  plus: {
    zh: '添筹',
    en: 'Plus',
    category: 'ui',
    shapes: [
      { tag: 'line', attrs: { x1: 12, y1: 5, x2: 12, y2: 19 } },
      { tag: 'line', attrs: { x1: 5, y1: 12, x2: 19, y2: 12 } }
    ]
  },
  minus: {
    zh: '减筹',
    en: 'Minus',
    category: 'ui',
    shapes: [
      { tag: 'line', attrs: { x1: 5, y1: 12, x2: 19, y2: 12 } }
    ]
  },
  'chevron-left': {
    zh: '左翻',
    en: 'Chevron Left',
    category: 'ui',
    shapes: [
      { tag: 'path', attrs: { d: 'M15 6 9 12l6 6' } }
    ]
  },
  'chevron-right': {
    zh: '右翻',
    en: 'Chevron Right',
    category: 'ui',
    shapes: [
      { tag: 'path', attrs: { d: 'M9 6l6 6-6 6' } }
    ]
  },
  'chevron-up': {
    zh: '上收',
    en: 'Chevron Up',
    category: 'ui',
    shapes: [
      { tag: 'path', attrs: { d: 'm6 15 6-6 6 6' } }
    ]
  },
  'chevron-down': {
    zh: '下展',
    en: 'Chevron Down',
    category: 'ui',
    shapes: [
      { tag: 'path', attrs: { d: 'm6 9 6 6 6-6' } }
    ]
  },
  settings: {
    zh: '枢机',
    en: 'Settings',
    category: 'ui',
    shapes: [
      { tag: 'circle', attrs: { cx: 12, cy: 12, r: 3 } },
      { tag: 'path', attrs: { d: 'M12 3.5v2M12 18.5v2M4.9 6.5l1.6 1M17.5 16.5l1.6 1M3.5 12h2M18.5 12h2M4.9 17.5l1.6-1M17.5 7.5l1.6-1' } },
      { tag: 'circle', attrs: { cx: 12, cy: 12, r: 6.8 } }
    ]
  },
  bell: {
    zh: '铜钟',
    en: 'Bell',
    category: 'ui',
    shapes: [
      { tag: 'path', attrs: { d: 'M7 16.5V11a5 5 0 0 1 10 0v5.5l1.5 2H5.5l1.5-2Z' } },
      { tag: 'path', attrs: { d: 'M10.5 18.5a1.5 1.5 0 0 0 3 0' } },
      { tag: 'line', attrs: { x1: 12, y1: 4, x2: 12, y2: 6 } }
    ]
  },
  user: {
    zh: '士人',
    en: 'Scholar',
    category: 'ui',
    shapes: [
      { tag: 'circle', attrs: { cx: 12, cy: 8.5, r: 3.5 } },
      { tag: 'path', attrs: { d: 'M5.5 19.5c.8-3.2 3.3-5 6.5-5s5.7 1.8 6.5 5' } }
    ]
  },
  copy: {
    zh: '拓印',
    en: 'Copy',
    category: 'ui',
    shapes: [
      { tag: 'rect', attrs: { x: 8, y: 8, width: 11, height: 12, rx: 1.5 } },
      { tag: 'path', attrs: { d: 'M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-8A1.5 1.5 0 0 0 5 5.5v10A1.5 1.5 0 0 0 6.5 17H8' } }
    ]
  },
  upload: {
    zh: '呈递',
    en: 'Upload',
    category: 'ui',
    shapes: [
      { tag: 'path', attrs: { d: 'M12 15V5m0 0-4 4m4-4 4 4' } },
      { tag: 'path', attrs: { d: 'M5 16.5v2A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-2' } }
    ]
  },
  download: {
    zh: '典藏',
    en: 'Download',
    category: 'ui',
    shapes: [
      { tag: 'path', attrs: { d: 'M12 4v10m0 0-4-4m4 4 4-4' } },
      { tag: 'path', attrs: { d: 'M5 16.5v2A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-2' } }
    ]
  },
  info: {
    zh: '注疏',
    en: 'Info',
    category: 'ui',
    shapes: [
      { tag: 'circle', attrs: { cx: 12, cy: 12, r: 8.5 } },
      { tag: 'line', attrs: { x1: 12, y1: 11, x2: 12, y2: 16 } },
      { tag: 'circle', attrs: { cx: 12, cy: 8, r: 0.7 } }
    ]
  },
  warning: {
    zh: '警示',
    en: 'Warning',
    category: 'ui',
    shapes: [
      { tag: 'polygon', attrs: { points: '12,4 20.5,19 3.5,19' } },
      { tag: 'line', attrs: { x1: 12, y1: 10, x2: 12, y2: 14.5 } },
      { tag: 'circle', attrs: { cx: 12, cy: 17, r: 0.6 } }
    ]
  },
  sparkles: {
    zh: '清晖',
    en: 'Sparkles',
    category: 'ui',
    shapes: [
      { tag: 'path', attrs: { d: 'M12 3.5 13.8 9.2 19.5 11l-5.7 1.8L12 18.5l-1.8-5.7L4.5 11l5.7-1.8L12 3.5Z' } },
      { tag: 'path', attrs: { d: 'M18.5 3.5v3M17 5h3M5.5 16.5v2.5M4.2 17.8h2.5' } }
    ]
  }
} as const satisfies Record<string, SongIconDef>;

export type SongIconName = keyof typeof SONG_ICON_DEFS;
export const SONG_ICON_NAMES = Object.keys(SONG_ICON_DEFS) as SongIconName[];
