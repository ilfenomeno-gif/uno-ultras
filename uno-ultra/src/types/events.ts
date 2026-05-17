import type { GameState } from './gamestate';
import type { FriendInvite, Mp3pState } from './mp';

export interface DomainEvents {
  'game:state': GameState;
  'game:started': { seed: number };
  'game:ended': { winnerId: string };
  'mp:connected': { peerId: string };
  'mp:desync': { expected: number; received: number };
  'friend:initialized': { count: number };
  'friend:invite-created': FriendInvite;
  'friend:online-changed': { code: string; online: boolean };
  'mp3p:state': Mp3pState;
  'mp3p:joined': { peerId: string };
  'mp3p:ready-changed': { peerId: string; ready: boolean };
  'mp3p:start': { roomCode: string };
  'ui:screen': { screen: string };
}
