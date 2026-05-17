import type { MpEffect, MpHostState, MpIncomingMessage, PeerInfo } from '../types/mp';
import { createHostState, hostApplyIncoming, hostRegisterPeer } from './protocol';

export class ConnectionManager {
  private peers = new Map<string, PeerInfo>();
  private hostState: MpHostState | null = null;

  upsertPeer(peer: PeerInfo): void {
    this.peers.set(peer.peerId, peer);
    if (this.hostState) {
      this.hostState = hostRegisterPeer(this.hostState, peer);
    }
  }

  listPeers(): PeerInfo[] {
    return [...this.peers.values()];
  }

  createHost(roomCode: string, token: string): MpHostState {
    this.hostState = createHostState(roomCode, token);
    return this.hostState;
  }

  getHostState(): MpHostState | null {
    return this.hostState;
  }

  handleIncoming(message: MpIncomingMessage): MpEffect[] {
    if (!this.hostState) return [];
    const outcome = hostApplyIncoming(this.hostState, message);
    this.hostState = outcome.state;
    return outcome.effects;
  }
}
