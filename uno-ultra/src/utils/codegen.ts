const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function genRoomCode(len = 6): string {
  return Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
}

export function genFriendCode(): string { return genRoomCode(6); }
