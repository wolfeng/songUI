/**
 * 北宋纵横算筹编码算法（秦九韶《数书九章》制：个位纵式、十位横式交替）
 */

const VERTICAL_ROD_DIGITS = ['〇', '〡', '〢', '〣', '〤', '〥', '〦', '〧', '〨', '〩'] as const;
const HORIZONTAL_ROD_DIGITS = ['〇', '一', '二', '三', '肆', '五', '丄', '丅', '丌', '〩'] as const;

export function toSongCountingRods(num: number): string {
  const safe = Math.max(0, Math.floor(num));
  const digits = String(safe).split('').map(Number);
  const len = digits.length;
  return digits
    .map((d, idx) => {
      const posFromRight = len - 1 - idx;
      return posFromRight % 2 === 0 ? VERTICAL_ROD_DIGITS[d] : HORIZONTAL_ROD_DIGITS[d];
    })
    .join(' ');
}
