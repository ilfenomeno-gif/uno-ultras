function makeEnvelope(payload) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    ts: Date.now(),
    payload,
  };
}

function randomPeerId() {
  return `p-${Math.random().toString(36).slice(2, 10)}`;
}

function randomRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function createRoomCode() {
  return randomRoomCode();
}

export function createPeerId() {
  return randomPeerId();
}

export function createTransport(roomCode, peerId, onMessage) {
  const channelName = `uno-ultra-v2-room-${roomCode.toLowerCase()}`;
  const bc = new BroadcastChannel(channelName);

  bc.onmessage = (event) => {
    const envelope = event.data;
    if (!envelope || !envelope.payload) return;
    onMessage(envelope.payload, envelope);
  };

  return {
    roomCode,
    peerId,
    send(payload) {
      bc.postMessage(makeEnvelope({
        ...payload,
        fromPeer: peerId,
      }));
    },
    close() {
      bc.close();
    },
  };
}
