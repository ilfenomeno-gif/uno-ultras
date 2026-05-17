import { describe, expect, it } from 'vitest';
import { addXp, xpForLevel } from '../src/progression/xp';

describe('xp', () => {
  it('grows by level', () => {
    expect(xpForLevel(3)).toBeGreaterThan(xpForLevel(1));
  });

  it('adds xp safely', () => {
    expect(addXp(10, 5)).toBe(15);
  });
});
