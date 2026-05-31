import { describe, expect, it } from 'vitest';
import { UnoEngine, createDeck } from '../src/game/uno';

describe('uno engine', () => {
  it('creates standard deck size', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(108);
  });

  it('starts with valid player hand size', () => {
    const game = new UnoEngine(4);
    const lengths = game.state.players.map((p) => p.hand.length);
    expect(lengths).toEqual([7, 7, 7, 7]);
  });

  it('advances turn when drawing', () => {
    const game = new UnoEngine(2);
    const start = game.state.currentPlayerIndex;
    game.drawForCurrent();
    expect(game.state.currentPlayerIndex).not.toBe(start);
  });
});
