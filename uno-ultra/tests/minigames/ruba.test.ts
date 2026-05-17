import { describe, it, expect } from 'vitest';
import { createRubaState } from '@minigames/ruba/engine.js';

describe('Ruba Mazzetto state', () => {
  it('crea stato con 2 giocatori', () => {
    const s = createRubaState([{name:'A',isAI:false},{name:'B',isAI:true}]);
    expect(s.players.length).toBe(2);
    expect(s.current).toBe(0);
  });
});
