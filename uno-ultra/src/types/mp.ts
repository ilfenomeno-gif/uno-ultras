export interface MpEnvelope<TPayload = unknown> {
  seq: number;
  token: string;
  type: string;
  payload: TPayload;
  sentAt: number;
}

export type MpMessageType =
  | 'join'
  | 'leave'
  | 'ready'
  | 'state-sync'
  | 'ping'
  | 'pong'
  | 'invite'
  | 'mp3p-join'
  | 'mp3p-ready'
  | 'mp3p-start';

export interface MpIncomingMessage {
  peerId: string;
  envelope: MpEnvelope;
}

export interface FriendRecord {
  code: string;
  name: string;
  online: boolean;
  lastSeenAt?: number;
}

export interface FriendInvite {
  toCode: string;
  fromPeerId: string;
  mode: '1v1' | '3p' | '2v2' | '3v3';
  createdAt: number;
}

export interface MpHostState {
  roomCode: string;
  token: string;
  expectedSeqByPeer: Record<string, number>;
  peers: Record<string, PeerInfo>;
  readyByPeer: Record<string, boolean>;
}

export type MpEffect =
  | { type: 'peer-connected'; peerId: string }
  | { type: 'peer-disconnected'; peerId: string }
  | { type: 'peer-ready'; peerId: string; ready: boolean }
  | { type: 'state-sync'; peerId: string; payload: unknown }
  | { type: 'send-pong'; peerId: string }
  | { type: 'invite-received'; peerId: string; payload: unknown }
  | { type: 'desync'; peerId: string; expected: number; received: number }
  | { type: 'invalid-token'; peerId: string };

export interface PeerInfo {
  peerId: string;
  username: string;
  connected: boolean;
}

export interface Mp3pSlot {
  peerId: string;
  name: string;
  ready: boolean;
  isHost: boolean;
}

export interface Mp3pState {
  roomCode: string;
  hostPeerId: string;
  slots: Mp3pSlot[];
  phase: 'idle' | 'hosting' | 'waiting' | 'ready' | 'in-game';
}

export type Mp3pAction =
  | { type: 'host-init'; roomCode: string; hostPeerId: string; hostName: string }
  | { type: 'guest-join'; peerId: string; name: string }
  | { type: 'guest-ready'; peerId: string; ready: boolean }
  | { type: 'guest-leave'; peerId: string }
  | { type: 'start' }
  | { type: 'reset' };

export type Mp3pEffect =
  | { type: 'joined'; peerId: string }
  | { type: 'ready-changed'; peerId: string; ready: boolean }
  | { type: 'all-ready' }
  | { type: 'started'; roomCode: string }
  | { type: 'ignored'; reason: string };

export interface MpState {
  roomCode: string;
  peers: PeerInfo[];
  expectedSeq: number;
}
