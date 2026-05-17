import type { Card, CardColor } from '../types/card';

const COLORS: CardColor[] = ['red', 'yellow', 'green', 'blue'];
const VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

let idCounter = 0;

function nextId(): string {
  idCounter += 1;
  return `c-${idCounter}`;
}

export function buildDeck(): Card[] {
  const deck: Card[] = [];

  for (const color of COLORS) {
    for (const value of VALUES) {
      deck.push({ id: nextId(), color, value });
    }
  }

  for (let i = 0; i < 4; i += 1) {
    deck.push({ id: nextId(), color: 'wild', value: 'wild' });
    deck.push({ id: nextId(), color: 'wild', value: 'wild4' });
  }

  return deck;
}

export function shuffleDeck(cards: Card[], seed = Date.now()): Card[] {
  const out = [...cards];
  let state = seed;

  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (state * 9301 + 49297) % 233280;
    const j = Math.floor((state / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}
