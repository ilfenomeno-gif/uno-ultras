import type {
  MpEffect,
  MpEnvelope,
  MpHostState,
  MpIncomingMessage,
  MpMessageType,
  PeerInfo
} from '../types/mp';

export function makeEnvelope<T>(seq: number, token: string, type: string, payload: T): MpEnvelope<T> {
  return {
    seq,
    token,
    type,
    payload,
    sentAt: Date.now()
  };
}

export function validateSequence(expected: number, incoming: number): boolean {
  return expected === incoming;
}

export function createHostState(roomCode: string, token: string): MpHostState {
  return {
    roomCode,
    token,
    expectedSeqByPeer: {},
    peers: {},
    readyByPeer: {}
  };
}

export function hostRegisterPeer(state: MpHostState, peer: PeerInfo): MpHostState {
  const next = structuredClone(state);
  next.peers[peer.peerId] = peer;
  if (next.expectedSeqByPeer[peer.peerId] === undefined) {
    next.expectedSeqByPeer[peer.peerId] = 1;
  }
  if (next.readyByPeer[peer.peerId] === undefined) {
    next.readyByPeer[peer.peerId] = false;
  }
  return next;
}

export function hostApplyIncoming(
  state: MpHostState,
  message: MpIncomingMessage
): { state: MpHostState; effects: MpEffect[] } {
  const { peerId, envelope } = message;
  const expected = state.expectedSeqByPeer[peerId] ?? 1;

  if (envelope.token !== state.token) {
    return {
      state,
      effects: [{ type: 'invalid-token', peerId }]
    };
  }

  if (!validateSequence(expected, envelope.seq)) {
    return {
      state,
      effects: [
        {
          type: 'desync',
          peerId,
          expected,
          received: envelope.seq
        }
      ]
    };
  }

  const next = structuredClone(state);
  next.expectedSeqByPeer[peerId] = expected + 1;

  const type = envelope.type as MpMessageType;
  switch (type) {
    case 'join': {
      return { state: next, effects: [{ type: 'peer-connected', peerId }] };
    }
    case 'leave': {
      delete next.readyByPeer[peerId];
      return { state: next, effects: [{ type: 'peer-disconnected', peerId }] };
    }
    case 'ready': {
      const payload = envelope.payload as { ready?: boolean } | undefined;
      const ready = Boolean(payload?.ready);
      next.readyByPeer[peerId] = ready;
      return {
        state: next,
        effects: [{ type: 'peer-ready', peerId, ready }]
      };
    }
    case 'state-sync': {
      return {
        state: next,
        effects: [{ type: 'state-sync', peerId, payload: envelope.payload }]
      };
    }
    case 'ping': {
      return { state: next, effects: [{ type: 'send-pong', peerId }] };
    }
    case 'invite': {
      return {
        state: next,
        effects: [{ type: 'invite-received', peerId, payload: envelope.payload }]
      };
    }
    case 'pong':
    default: {
      return { state: next, effects: [] };
    }
  }
}
