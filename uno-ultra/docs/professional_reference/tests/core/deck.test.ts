import { describe, it, expect } from 'vitest';
import { buildDeck, shuffle, dealHands } from '@core/deck.js';

describe('buildDeck', () => {
  it('contiene 108 carte', () => expect(buildDeck().length).toBe(108));
  it('ha 4 wild e 4 wild+4',  () => {
    const d = buildDeck();
    expect(d.filter(c => c.val === 'wild').length).toBe(4);
    expect(d.filter(c => c.val === 'wild+4').length).toBe(4);
  });
});

describe('shuffle', () => {
  it('non perde carte', () => expect(shuffle(buildDeck()).length).toBe(108));
  it('cambia ordine (prob)', () => {
    const d = buildDeck();
    expect(shuffle([...d])[0]).not.toStrictEqual(d[0]); // prob 1/108 fail
  });
});

describe('dealHands', () => {
  it('distribuisce 7 carte a ciascun giocatore', () => {
    const [hands] = dealHands(buildDeck(), 4);
    hands.forEach(h => expect(h.length).toBe(7));
  });
});
