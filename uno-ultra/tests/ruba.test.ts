import { describe, expect, it } from 'vitest';
import { createRubaState, stepRuba } from '../src/minigames/ruba/engine';

describe('ruba minigame', () => {
  it('increments turn', () => {
    const state = createRubaState();
    const next = stepRuba(state);
    expect(next.turn).toBe(1);
  });
});
