import { describe, it, expect } from 'vitest';
import {
  getShichenName,
  getNightWatchLabel,
  getSundialShadowAngle,
  toSongCountingRods,
  formatIncenseDuration,
  PENTATONIC_NOTES,
  validateField,
  songRules
} from '../src/index.js';

describe('@song-ui/core', () => {
  it('computes traditional Shichen names accurately', () => {
    expect(getShichenName(0)).toBe('子正');
    expect(getShichenName(720)).toBe('午正');
    expect(getShichenName(660)).toBe('午初');
  });

  it('computes night watch and day clepsydra water ratios', () => {
    const midnight = getNightWatchLabel(0);
    expect(midnight.isNight).toBe(true);
    expect(midnight.text).toBe('三更三点');
    expect(midnight.ratio).toBeCloseTo(0.5, 2);

    const noon = getNightWatchLabel(720);
    expect(noon.isNight).toBe(false);
    expect(noon.text).toBe('昼漏第50刻');
  });

  it('computes sundial shadow angle', () => {
    expect(getSundialShadowAngle(720)).toBe(0);
    expect(getSundialShadowAngle(780)).toBe(15);
  });

  it('encodes Song counting rods with alternating vertical and horizontal digits', () => {
    expect(toSongCountingRods(27)).toBe('二 〧');
    expect(toSongCountingRods(5)).toBe('〥');
  });

  it('formats incense duration cleanly', () => {
    expect(formatIncenseDuration(15)).toBe('00:15');
    expect(formatIncenseDuration(905)).toBe('15:05');
  });

  it('exposes five pentatonic notes', () => {
    expect(PENTATONIC_NOTES).toHaveLength(5);
  });

  it('validates fields with Vuetify-style rules', () => {
    const rules = [songRules.required(), songRules.minLength(3)];
    expect(validateField('', rules)).toEqual({
      valid: false,
      errors: ['此项须落墨填具，不可留白', '文辞至少须 3 字']
    });
    expect(validateField('清明上河', rules)).toEqual({
      valid: true,
      errors: []
    });
    expect(validateField(15, [songRules.range(1, 10)])).toEqual({
      valid: false,
      errors: ['数值须介于 1 至 10 之间']
    });
  });
});
