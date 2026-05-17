import { describe, expect, it } from 'vitest';
import { createMp3pInitialState, reduceMp3p } from '../src/multiplayer/mp3pStateMachine';

describe('mp3p state machine', () => {
  it('hosts then joins to 3 slots', () => {
    let state = createMp3pInitialState();

    state = reduceMp3p(state, {
      type: 'host-init',
      roomCode: 'ROOM3P',
      hostPeerId: 'host',
      hostName: 'Host'
    }).state;

    state = reduceMp3p(state, { type: 'guest-join', peerId: 'g1', name: 'Guest1' }).state;
    state = reduceMp3p(state, { type: 'guest-join', peerId: 'g2', name: 'Guest2' }).state;

    expect(state.slots).toHaveLength(3);
    expect(state.phase).toBe('waiting');
  });

  it('moves to ready then in-game', () => {
    let state = createMp3pInitialState();
    state = reduceMp3p(state, {
      type: 'host-init',
      roomCode: 'ROOM3P',
      hostPeerId: 'host',
      hostName: 'Host'
    }).state;
    state = reduceMp3p(state, { type: 'guest-join', peerId: 'g1', name: 'Guest1' }).state;
    state = reduceMp3p(state, { type: 'guest-join', peerId: 'g2', name: 'Guest2' }).state;

    state = reduceMp3p(state, { type: 'guest-ready', peerId: 'g1', ready: true }).state;
    state = reduceMp3p(state, { type: 'guest-ready', peerId: 'g2', ready: true }).state;

    expect(state.phase).toBe('ready');

    const started = reduceMp3p(state, { type: 'start' });
    expect(started.state.phase).toBe('in-game');
    expect(started.effects[0]).toEqual({ type: 'started', roomCode: 'ROOM3P' });
  });
});
