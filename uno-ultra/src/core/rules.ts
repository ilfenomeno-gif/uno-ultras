import type { Card } from '../types/card';

export function isPlayableCard(card: Card, topCard: Card): boolean {
  if (card.color === 'wild') return true;
  return card.color === topCard.color || card.value === topCard.value;
}
