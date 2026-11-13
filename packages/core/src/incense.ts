/**
 * 一柱香倒计时状态与格式化工具
 */

export type IncenseStatus = 'idle' | 'burning' | 'paused' | 'finished';

export function formatIncenseDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const m = String(Math.floor(safe / 60)).padStart(2, '0');
  const s = String(safe % 60).padStart(2, '0');
  return `${m}:${s}`;
}
