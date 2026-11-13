/**
 * 宋代司辰算法：十二时辰、五更百刻、赤道式日晷晷影角度
 * Framework-agnostic — directly portable to Swift / Kotlin / Web
 */

export const EARTH_BRANCHES = ['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'] as const;
const SHICHEN_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
const WATCH_NAMES = ['一更', '二更', '三更', '四更', '五更'] as const;
const POINT_NAMES = ['一点', '二点', '三点', '四点', '五点'] as const;

export interface NightWatchInfo {
  isNight: boolean;
  text: string;
  /** 0.0 to 1.0 water level ratio inside the clepsydra chamber */
  ratio: number;
}

/**
 * 将一日分钟数 [0, 1440) 转换为传统十二时辰名称（如「子初」「午正」）
 */
export function getShichenName(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  const idx = Math.floor(((m + 60) % 1440) / 120);
  const half = ((m + 60) % 120) < 60 ? '初' : '正';
  return `${SHICHEN_NAMES[idx]}${half}`;
}

/**
 * 计算夜间五更（19:00-05:00）或白昼百刻（05:00-19:00）的刻漏水位比例
 */
export function getNightWatchLabel(totalMinutes: number): NightWatchInfo {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  const nightOffset = m >= 1140 ? m - 1140 : m < 300 ? m + 300 : -1;

  if (nightOffset >= 0 && nightOffset < 600) {
    const wIdx = Math.floor(nightOffset / 120);
    const pIdx = Math.floor((nightOffset % 120) / 24);
    return {
      isNight: true,
      text: `${WATCH_NAMES[wIdx]}${POINT_NAMES[pIdx]}`,
      ratio: nightOffset / 600
    };
  }

  const dayOffset = m - 300;
  const ke = Math.min(100, Math.max(1, Math.round((dayOffset / 840) * 100)));
  return {
    isNight: false,
    text: `昼漏第${ke}刻`,
    ratio: dayOffset / 840
  };
}

/**
 * 计算赤道式日晷晷影旋转角度（正午 12:00 为 0°）
 */
export function getSundialShadowAngle(totalMinutes: number): number {
  return ((totalMinutes - 720) / 60) * 15;
}
