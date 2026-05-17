import { describe, expect, it } from 'vitest';
import { FriendService } from '../src/multiplayer/FriendService';
import { Emitter } from '../src/utils/emitter';
import type { DomainEvents } from '../src/types/events';

describe('friend service', () => {
  it('initializes and emits initialized event', () => {
    const events = new Emitter<DomainEvents>();
    let seen = 0;
    events.on('friend:initialized', ({ count }) => {
      seen = count;
    });

    const service = new FriendService(events);
    service.init([
      { code: 'ABC123', name: 'Luca', online: true },
      { code: 'DEF456', name: 'Marta', online: false }
    ]);

    expect(service.list()).toHaveLength(2);
    expect(seen).toBe(2);
  });

  it('creates invite only for online friends', () => {
    const service = new FriendService();
    service.init([
      { code: 'AAA111', name: 'Online', online: true },
      { code: 'BBB222', name: 'Offline', online: false }
    ]);

    const ok = service.inviteFriend('AAA111', 'host-1', '1v1');
    const ko = service.inviteFriend('BBB222', 'host-1', '1v1');

    expect(ok?.toCode).toBe('AAA111');
    expect(ko).toBeNull();
  });
});
