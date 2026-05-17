import type { Card } from '../types/card';

export type Difficulty = 'easy' | 'normal' | 'hard' | 'ultra';

export function chooseCard(hand: Card[], playable: Card[], difficulty: Difficulty): Card | null {
  if (playable.length === 0) return null;
  if (difficulty === 'easy') return playable[0];
  if (difficulty === 'normal') return playable[Math.floor(playable.length / 2)];
  if (difficulty === 'hard') {
    return [...playable].sort((a, b) => String(a.value).localeCompare(String(b.value)))[0];
  }
  return [...playable].sort((a, b) => String(b.value).localeCompare(String(a.value)))[0] ?? hand[0] ?? null;
}
