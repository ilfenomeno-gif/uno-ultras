import type { Card } from '../types/card';

export function renderCardLabel(card: Card): string {
  return `${card.color.toUpperCase()} ${String(card.value).toUpperCase()}`;
}
