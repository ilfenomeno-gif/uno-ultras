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

function getDefaultWSUrl() {
  if (typeof window === "undefined") return null;
  const force = window.localStorage?.getItem("uno-ultra-v2-ws-url") || "";
  if (force) return force;
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws`;
}

function getClientIdentity() {
  if (typeof window === "undefined") {
    return { peerId: createPeerId(), userName: "Guest" };
  }

  const peerKey = "uno-ultra-v2-peer-id";
  let peerId = window.localStorage?.getItem(peerKey);
  if (!peerId) {
    peerId = createPeerId();
    window.localStorage?.setItem(peerKey, peerId);
  }

  let userName = "Guest";
  try {
    userName = String(window.localStorage?.getItem("uno-ultra-shell-profile-v1") ? JSON.parse(window.localStorage.getItem("uno-ultra-shell-profile-v1")).name : "Guest") || "Guest";
  } catch {
    userName = "Guest";
  }
  return { peerId, userName };
}

function createLocalTransport(roomCode, peerId, onMessage) {
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
    mode: "local-broadcast-channel",
  };
}

function createWebSocketTransport(roomCode, peerId, onMessage) {
  const wsUrl = getDefaultWSUrl();
  if (!wsUrl || typeof WebSocket === "undefined") return null;

  const identity = getClientIdentity();
  const finalPeerId = peerId || identity.peerId;
  const userName = identity.userName || "Guest";

  const url = new URL(wsUrl, window.location.href);
  url.searchParams.set("peerId", finalPeerId);
  url.searchParams.set("userName", userName);

  const socket = new WebSocket(url.toString());
  const outgoingQueue = [];
  let joined = false;

  const flush = () => {
    while (socket.readyState === WebSocket.OPEN && outgoingQueue.length > 0) {
      const item = outgoingQueue.shift();
      try {
        socket.send(JSON.stringify(item));
      } catch {
        break;
      }
    }
  };

  const sendOrQueue = (data) => {
    outgoingQueue.push(data);
    flush();
  };

  socket.addEventListener("open", () => {
    sendOrQueue({
      type: "hello",
      payload: { peerId: finalPeerId, userName },
    });
    sendOrQueue({
      type: "room:join",
      payload: { roomCode, host: false },
    });
    joined = true;
    flush();
  });

  socket.addEventListener("message", (evt) => {
    let msg;
    try {
      msg = JSON.parse(evt.data);
    } catch {
      return;
    }
    if (!msg || typeof msg !== "object") return;

    if (msg.type === "room:event") {
      const out = msg.payload || {};
      if (String(out.roomCode || "").toUpperCase() !== String(roomCode).toUpperCase()) return;
      const payload = out.payload || {};
      const envelope = {
        id: out.eventId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ts: msg.ts || Date.now(),
        payload,
      };
      onMessage(payload, envelope);
    }
  });

  return {
    roomCode,
    peerId: finalPeerId,
    send(payload) {
      if (socket.readyState !== WebSocket.OPEN && socket.readyState !== WebSocket.CONNECTING) return;
      sendOrQueue({
        type: "room:event",
        payload: {
          roomCode,
          payload: {
            ...payload,
            fromPeer: finalPeerId,
          },
        },
      });
    },
    close() {
      if (joined && socket.readyState === WebSocket.OPEN) {
        try {
          socket.send(JSON.stringify({
            type: "room:leave",
            payload: { roomCode },
          }));
        } catch {
          // noop
        }
      }
      try {
        socket.close();
      } catch {
        // noop
      }
    },
    mode: "online-websocket",
  };
}

export function createTransport(roomCode, peerId, onMessage) {
  const wsTransport = createWebSocketTransport(roomCode, peerId, onMessage);
  if (wsTransport) return wsTransport;
  return createLocalTransport(roomCode, peerId, onMessage);
}

export function createPresenceChannel(peerId, userName = "Guest") {
  const wsUrl = getDefaultWSUrl();
  if (!wsUrl || typeof WebSocket === "undefined") return null;

  const id = peerId || getClientIdentity().peerId;
  const url = new URL(wsUrl, window.location.href);
  url.searchParams.set("peerId", id);
  url.searchParams.set("userName", userName || "Guest");
  const socket = new WebSocket(url.toString());

  const listeners = new Set();
  socket.addEventListener("message", (evt) => {
    let msg;
    try {
      msg = JSON.parse(evt.data);
    } catch {
      return;
    }
    listeners.forEach((fn) => {
      try {
        fn(msg);
      } catch {
        // noop
      }
    });
  });

  const send = (type, payload = {}) => {
    if (socket.readyState !== WebSocket.OPEN) return false;
    try {
      socket.send(JSON.stringify({ type, payload }));
      return true;
    } catch {
      return false;
    }
  };

  socket.addEventListener("open", () => {
    send("hello", { peerId: id, userName });
  });

  return {
    peerId: id,
    send,
    onMessage(listener) {
      if (typeof listener === "function") listeners.add(listener);
      return () => listeners.delete(listener);
    },
    close() {
      try {
        socket.close();
      } catch {
        // noop
      }
    },
  };
}
