import { describe, it, expect } from 'vitest';
import { canPlay } from '@core/rules.js';

const r5: any = { col:'r', val:'5' };
const b5: any = { col:'b', val:'5' };
const g3: any = { col:'g', val:'3' };
const wild: any = { col:'w', val:'wild' };

describe('canPlay', () => {
  it('stessa colore',  () => expect(canPlay(r5, g3, 'r')).toBe(true));
  it('stesso valore',  () => expect(canPlay(b5, r5, 'r')).toBe(true));
  it('wild sempre',    () => expect(canPlay(wild, r5, 'r')).toBe(true));
  it('no match',       () => expect(canPlay(g3, r5, 'r')).toBe(false));
});
