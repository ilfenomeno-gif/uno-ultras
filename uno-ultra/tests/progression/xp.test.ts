import { describe, it, expect } from 'vitest';
import { addXP, xpForLevel } from '@progression/xp.js';
import { createProfile } from '@auth/profile.js';

describe('addXP', () => {
  it('incrementa XP', () => {
    const p = createProfile('test');
    addXP(p, 50);
    expect(p.xp).toBe(50);
  });
  it('avanza di livello', () => {
    const p = createProfile('test');
    addXP(p, xpForLevel(1) + 10);
    expect(p.level).toBe(2);
  });
});
