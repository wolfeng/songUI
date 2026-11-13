/**
 * 五声音阶与宋代器物声学参数规范（Web Audio 与 SwiftUI AVAudioEngine 共用参数表）
 */

export interface PentatonicNote {
  key: 'gong' | 'shang' | 'jue' | 'zhi' | 'yu';
  name: string;
  eraLabel: string;
  freq: number;
}

export const PENTATONIC_NOTES: readonly PentatonicNote[] = [
  { key: 'gong', name: '宫音', eraLabel: '建隆元年', freq: 261.63 },
  { key: 'shang', name: '商音', eraLabel: '景德元年', freq: 293.66 },
  { key: 'jue', name: '角音', eraLabel: '熙宁七年', freq: 329.63 },
  { key: 'zhi', name: '徵音', eraLabel: '元祐元年', freq: 392.0 },
  { key: 'yu', name: '羽音', eraLabel: '宣和五年', freq: 440.0 }
] as const;

export const CELADON_FREQS = {
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5_SHARP: 740.0,
  G5: 783.99,
  A5: 880.0,
  C6: 1046.5
} as const;
