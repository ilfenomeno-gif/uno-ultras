import { describe, expect, it } from 'vitest';
import { buildDeck, shuffleDeck } from '../src/core/deck';

describe('deck', () => {
  it('builds non empty deck', () => {
    const deck = buildDeck();
    expect(deck.length).toBeGreaterThan(0);
  });

  it('shuffle keeps same size', () => {
    const deck = buildDeck();
    const shuffled = shuffleDeck(deck, 123);
    expect(shuffled).toHaveLength(deck.length);
  });
});
