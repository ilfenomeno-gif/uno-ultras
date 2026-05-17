import type { DomainEvents } from '../types/events';
import type { FriendInvite, FriendRecord } from '../types/mp';
import { Emitter } from '../utils/emitter';

export type Friend = FriendRecord;

export class FriendService {
  private friends = new Map<string, FriendRecord>();

  constructor(private readonly events?: Emitter<DomainEvents>) {}

  init(seed: FriendRecord[] = []): FriendRecord[] {
    for (const friend of seed) {
      this.friends.set(friend.code, friend);
    }
    this.events?.emit('friend:initialized', { count: this.friends.size });
    return this.list();
  }

  add(friend: FriendRecord): void {
    this.friends.set(friend.code, friend);
  }

  list(): FriendRecord[] {
    return [...this.friends.values()];
  }

  setOnline(code: string, online: boolean): void {
    const current = this.friends.get(code);
    if (!current) return;

    const next: FriendRecord = {
      ...current,
      online,
      lastSeenAt: online ? current.lastSeenAt : Date.now()
    };
    this.friends.set(code, next);
    this.events?.emit('friend:online-changed', { code, online });
  }

  inviteFriend(
    toCode: string,
    fromPeerId: string,
    mode: FriendInvite['mode'] = '1v1'
  ): FriendInvite | null {
    const to = this.friends.get(toCode);
    if (!to || !to.online) return null;

    const invite: FriendInvite = {
      toCode,
      fromPeerId,
      mode,
      createdAt: Date.now()
    };
    this.events?.emit('friend:invite-created', invite);
    return invite;
  }
}
