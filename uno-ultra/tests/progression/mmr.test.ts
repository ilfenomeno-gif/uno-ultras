import { describe, it, expect } from 'vitest';
import { calcMMRDelta } from '@progression/mmr.js';

describe('calcMMRDelta', () => {
  it('vittoria vs pari → positivo',  () => expect(calcMMRDelta(true,  200, 200)).toBeGreaterThan(0));
  it('sconfitta vs pari → negativo', () => expect(calcMMRDelta(false, 200, 200)).toBeLessThan(0));
  it('vittoria vs forte → alto',     () => {
    const d1 = calcMMRDelta(true, 1000, 200);
    const d2 = calcMMRDelta(true, 200,  200);
    expect(d1).toBeGreaterThan(d2);
  });
});
