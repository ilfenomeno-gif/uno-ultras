import type { GameState } from './gamestate';

export interface DomainEvents {
  'game:state': GameState;
  'game:started': { seed: number };
  'game:ended': { winnerId: string };
  'mp:connected': { peerId: string };
  'mp:desync': { expected: number; received: number };
  'ui:screen': { screen: string };
}
