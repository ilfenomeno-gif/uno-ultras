import type { PeerInfo } from '../types/mp';

export class ConnectionManager {
  private peers = new Map<string, PeerInfo>();

  upsertPeer(peer: PeerInfo): void {
    this.peers.set(peer.peerId, peer);
  }

  listPeers(): PeerInfo[] {
    return [...this.peers.values()];
  }
}
