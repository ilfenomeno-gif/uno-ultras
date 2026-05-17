import type { CardColor } from '../types/card';

export interface SeenStats {
  seenColors: Record<CardColor, number>;
}

export function createTracking(): SeenStats {
  return {
    seenColors: {
      red: 0,
      yellow: 0,
      green: 0,
      blue: 0,
      wild: 0
    }
  };
}
