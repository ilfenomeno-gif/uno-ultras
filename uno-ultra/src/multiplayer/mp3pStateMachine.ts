import type { Mp3pAction, Mp3pEffect, Mp3pState } from '../types/mp';

export function createMp3pInitialState(): Mp3pState {
  return {
    roomCode: '',
    hostPeerId: '',
    slots: [],
    phase: 'idle'
  };
}

export function reduceMp3p(
  state: Mp3pState,
  action: Mp3pAction
): { state: Mp3pState; effects: Mp3pEffect[] } {
  switch (action.type) {
    case 'reset': {
      return { state: createMp3pInitialState(), effects: [] };
    }

    case 'host-init': {
      const next: Mp3pState = {
        roomCode: action.roomCode,
        hostPeerId: action.hostPeerId,
        phase: 'hosting',
        slots: [
          {
            peerId: action.hostPeerId,
            name: action.hostName,
            ready: true,
            isHost: true
          }
        ]
      };
      return { state: next, effects: [] };
    }

    case 'guest-join': {
      if (state.slots.find((s) => s.peerId === action.peerId)) {
        return {
          state,
          effects: [{ type: 'ignored', reason: 'peer-already-joined' }]
        };
      }
      if (state.slots.length >= 3) {
        return {
          state,
          effects: [{ type: 'ignored', reason: 'lobby-full' }]
        };
      }

      const nextSlots = [
        ...state.slots,
        {
          peerId: action.peerId,
          name: action.name,
          ready: false,
          isHost: false
        }
      ];

      const next: Mp3pState = {
        ...state,
        slots: nextSlots,
        phase: nextSlots.length === 3 ? 'waiting' : state.phase
      };
      return {
        state: next,
        effects: [{ type: 'joined', peerId: action.peerId }]
      };
    }

    case 'guest-ready': {
      const nextSlots = state.slots.map((slot) =>
        slot.peerId === action.peerId ? { ...slot, ready: action.ready } : slot
      );
      const allReady = nextSlots.length === 3 && nextSlots.every((slot) => slot.ready);

      const effects: Mp3pEffect[] = [{
        type: 'ready-changed',
        peerId: action.peerId,
        ready: action.ready
      }];
      if (allReady) effects.push({ type: 'all-ready' });

      const next: Mp3pState = {
        ...state,
        slots: nextSlots,
        phase: allReady ? 'ready' : 'waiting'
      };

      return { state: next, effects };
    }

    case 'guest-leave': {
      const nextSlots = state.slots.filter((slot) => slot.peerId !== action.peerId);
      const next: Mp3pState = {
        ...state,
        slots: nextSlots,
        phase: nextSlots.length >= 3 ? 'waiting' : 'hosting'
      };
      return {
        state: next,
        effects: [{ type: 'ignored', reason: `peer-left:${action.peerId}` }]
      };
    }

    case 'start': {
      if (state.phase !== 'ready') {
        return {
          state,
          effects: [{ type: 'ignored', reason: 'cannot-start-not-ready' }]
        };
      }

      const next: Mp3pState = {
        ...state,
        phase: 'in-game'
      };

      return {
        state: next,
        effects: [{ type: 'started', roomCode: state.roomCode }]
      };
    }

    default: {
      return { state, effects: [] };
    }
  }
}
