import { describe, expect, it } from 'vitest';
import {
  createHostState,
  hostApplyIncoming,
  hostRegisterPeer,
  makeEnvelope
} from '../src/multiplayer/protocol';

describe('mp host onData reducer', () => {
  it('accepts ready packet with valid seq/token', () => {
    let state = createHostState('ab12', 'tk1');
    state = hostRegisterPeer(state, { peerId: 'p1', username: 'guest', connected: true });

    const msg = {
      peerId: 'p1',
      envelope: makeEnvelope(1, 'tk1', 'ready', { ready: true })
    };

    const out = hostApplyIncoming(state, msg);
    expect(out.effects[0]).toEqual({ type: 'peer-ready', peerId: 'p1', ready: true });
    expect(out.state.readyByPeer.p1).toBe(true);
    expect(out.state.expectedSeqByPeer.p1).toBe(2);
  });

  it('emits desync effect on wrong seq', () => {
    const state = hostRegisterPeer(createHostState('ab12', 'tk1'), {
      peerId: 'p1',
      username: 'guest',
      connected: true
    });

    const out = hostApplyIncoming(state, {
      peerId: 'p1',
      envelope: makeEnvelope(3, 'tk1', 'ping', {})
    });

    expect(out.effects[0]).toEqual({ type: 'desync', peerId: 'p1', expected: 1, received: 3 });
  });
});
