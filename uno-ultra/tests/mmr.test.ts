import { describe, expect, it } from 'vitest';
import { calcMmrDelta } from '../src/progression/mmr';

describe('mmr', () => {
  it('returns positive delta on win vs stronger opponent', () => {
    expect(calcMmrDelta(200, 260, true)).toBeGreaterThan(0);
  });

  it('returns negative delta on loss', () => {
    expect(calcMmrDelta(200, 180, false)).toBeLessThan(0);
  });
});
