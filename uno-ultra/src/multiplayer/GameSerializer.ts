import type { GameState } from '../types/gamestate';

export function serializeGame(state: GameState): string {
  return JSON.stringify(state);
}

export function deserializeGame(raw: string): GameState {
  return JSON.parse(raw) as GameState;
}

export function buildPlayerView(state: GameState, playerId: string): GameState {
  const out = structuredClone(state);
  out.players = out.players.map((p) => {
    if (p.id === playerId) return p;
    return { ...p, hand: p.hand.map(() => ({ id: 'hidden', color: 'wild', value: 'wild' })) };
  });
  return out;
}
