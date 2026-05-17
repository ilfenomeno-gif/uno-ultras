import type { MpEnvelope } from '../types/mp';
import { ConnectionManager } from './ConnectionManager';
import { FriendService } from './FriendService';
import { Mp3pLobbyController } from './Mp3pLobbyController';

function randomToken(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function installLegacyMpBridge(
  manager: ConnectionManager,
  friends: FriendService,
  mp3pLobby: Mp3pLobbyController
): void {
  const w = window as Window & {
    mpHostInit?: () => void;
    mpOnData?: (data: unknown) => void;
    frInit?: () => void;
    frInviteFriend?: (friendCode: string) => void;
    mp3pHostInit?: () => void;
    mp3pJoin?: () => void;
    mp3pGuestOnData?: (data: unknown) => void;
    __mpRoomCode?: string;
    __mpToken?: string;
    __friendSeed?: Array<{ code: string; name: string; online: boolean }>;
    __mp3pRoomCode?: string;
    __mp3pHostPeerId?: string;
    __mp3pGuestPeerId?: string;
  };

  w.mpHostInit = () => {
    const roomCode = w.__mpRoomCode ?? 'room-local';
    const token = w.__mpToken ?? randomToken();
    w.__mpToken = token;
    manager.createHost(roomCode, token);
  };

  w.mpOnData = (data: unknown) => {
    const envelope = data as MpEnvelope;
    const peerId = 'legacy-peer';
    manager.handleIncoming({
      peerId,
      envelope
    });
  };

  w.frInit = () => {
    friends.init(w.__friendSeed ?? []);
  };

  w.frInviteFriend = (friendCode: string) => {
    const fromPeerId = w.__mp3pHostPeerId ?? 'legacy-host';
    friends.inviteFriend(friendCode, fromPeerId, '1v1');
  };

  w.mp3pHostInit = () => {
    const roomCode = w.__mp3pRoomCode ?? '3p-local';
    const hostPeerId = w.__mp3pHostPeerId ?? 'legacy-host';
    mp3pLobby.hostInit(hostPeerId, 'Host', roomCode);
  };

  w.mp3pJoin = () => {
    const guestPeerId = w.__mp3pGuestPeerId ?? `guest-${randomToken()}`;
    w.__mp3pGuestPeerId = guestPeerId;
    mp3pLobby.guestJoin(guestPeerId, 'Guest');
  };

  w.mp3pGuestOnData = (data: unknown) => {
    const peerId = w.__mp3pGuestPeerId ?? 'legacy-guest';
    mp3pLobby.guestOnData(peerId, data);
  };
}
