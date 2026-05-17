export interface MpEnvelope<TPayload = unknown> {
  seq: number;
  token: string;
  type: string;
  payload: TPayload;
  sentAt: number;
}

export interface PeerInfo {
  peerId: string;
  username: string;
  connected: boolean;
}

export interface MpState {
  roomCode: string;
  peers: PeerInfo[];
  expectedSeq: number;
}
