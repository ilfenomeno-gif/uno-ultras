import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav"
};

function resolveRequest(urlPath) {
  const clean = decodeURIComponent((urlPath || "/").split("?")[0]);
  const target = clean === "/" ? "/index.html" : clean;
  return path.normalize(path.join(root, target));
}

const server = createServer((req, res) => {
  const resolved = resolveRequest(req.url || "/");
  if (!resolved.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  let filePath = resolved;
  if (!existsSync(filePath)) {
    filePath = path.join(root, "index.html");
  }
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
  createReadStream(filePath).pipe(res);
});

const wss = new WebSocketServer({ server, path: "/ws" });

const PRESENCE = {
  ONLINE: "online",
  IN_LOBBY: "in_lobby",
  IN_MATCH: "in_match",
  OFFLINE: "offline",
};

const clients = new Map();
const userIndex = new Map();
const rooms = new Map();
const invites = new Map();
const matches = new Map();

function now() {
  return Date.now();
}

function safeSend(ws, payload) {
  if (!ws || ws.readyState !== ws.OPEN) return false;
  try {
    ws.send(JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

function envelope(type, payload = {}) {
  return {
    type,
    ts: now(),
    payload,
  };
}

function normalizeUserName(name = "") {
  return String(name || "").trim().toLowerCase();
}

function getPublicSession(peerId) {
  const session = clients.get(peerId);
  if (!session) return null;
  return {
    peerId: session.peerId,
    userName: session.userName,
    presence: session.presence,
    roomCode: session.roomCode || null,
    mode: session.mode || null,
    updatedAt: session.updatedAt,
  };
}

function pushPresenceUpdate(targetPeerIds = null) {
  const snapshot = [...clients.values()].map((session) => getPublicSession(session.peerId)).filter(Boolean);
  const payload = envelope("presence:snapshot", { users: snapshot });
  if (!targetPeerIds) {
    clients.forEach((session) => {
      safeSend(session.ws, payload);
    });
    return;
  }
  targetPeerIds.forEach((peerId) => {
    const target = clients.get(peerId);
    if (target) safeSend(target.ws, payload);
  });
}

function detachFromRoom(peerId, reason = "leave") {
  const session = clients.get(peerId);
  if (!session) return;
  const roomCode = session.roomCode;
  if (!roomCode) return;
  const room = rooms.get(roomCode);
  session.roomCode = null;
  if (!room) return;

  room.members.delete(peerId);
  if (room.hostPeerId === peerId) {
    const [nextHost] = [...room.members];
    room.hostPeerId = nextHost || null;
  }

  const evt = envelope("room:update", {
    roomCode,
    reason,
    hostPeerId: room.hostPeerId,
    members: [...room.members],
  });
  room.members.forEach((memberId) => {
    const target = clients.get(memberId);
    if (target) safeSend(target.ws, evt);
  });

  if (room.members.size === 0) {
    rooms.delete(roomCode);
    matches.delete(roomCode);
  }
}

function upsertRoom(roomCode, hostPeerId = null) {
  const clean = String(roomCode || "").trim().toUpperCase();
  if (!clean) return null;
  if (!rooms.has(clean)) {
    rooms.set(clean, {
      roomCode: clean,
      hostPeerId: hostPeerId || null,
      members: new Set(),
      config: {
        mode: null,
        players: 2,
        isCompetitive: false,
      },
      createdAt: now(),
      updatedAt: now(),
    });
  }
  const room = rooms.get(clean);
  if (hostPeerId && !room.hostPeerId) room.hostPeerId = hostPeerId;
  room.updatedAt = now();
  return room;
}

function applyPresence(peerId, patch = {}) {
  const session = clients.get(peerId);
  if (!session) return;
  const nextPresence = String(patch.presence || session.presence || PRESENCE.ONLINE);
  const nextRoomCode = patch.roomCode == null ? session.roomCode : String(patch.roomCode || "").trim().toUpperCase() || null;
  const nextMode = patch.mode == null ? session.mode : patch.mode || null;

  if (nextRoomCode !== session.roomCode) {
    detachFromRoom(peerId, "presence-room-change");
    if (nextRoomCode) {
      const room = upsertRoom(nextRoomCode);
      if (room) {
        room.members.add(peerId);
        if (!room.hostPeerId) room.hostPeerId = peerId;
      }
      session.roomCode = nextRoomCode;
    }
  }

  session.presence = nextPresence;
  session.mode = nextMode;
  session.updatedAt = now();
}

function resolveInviteTarget(toPeerId, toUserName) {
  if (toPeerId && clients.has(toPeerId)) return toPeerId;
  if (!toUserName) return null;
  const byName = userIndex.get(normalizeUserName(toUserName));
  if (!byName || byName.size === 0) return null;
  return [...byName][0] || null;
}

function registerInvite(fromPeerId, payload = {}) {
  const targetPeerId = resolveInviteTarget(payload.toPeerId, payload.toUserName);
  if (!targetPeerId) return { ok: false, code: "TARGET_OFFLINE" };

  const fromSession = clients.get(fromPeerId);
  const toSession = clients.get(targetPeerId);
  if (!fromSession || !toSession) return { ok: false, code: "TARGET_OFFLINE" };

  if (toSession.presence === PRESENCE.IN_MATCH || toSession.presence === PRESENCE.IN_LOBBY) {
    return { ok: false, code: "TARGET_BUSY" };
  }

  const inviteId = `inv-${now()}-${Math.random().toString(36).slice(2, 8)}`;
  const invite = {
    inviteId,
    fromPeerId,
    toPeerId: targetPeerId,
    roomCode: String(payload.roomCode || "").trim().toUpperCase() || null,
    mode: payload.mode || null,
    players: Number(payload.players || 2),
    status: "pending",
    createdAt: now(),
  };
  invites.set(inviteId, invite);

  safeSend(toSession.ws, envelope("invite:incoming", {
    inviteId,
    fromPeerId,
    fromUserName: fromSession.userName,
    roomCode: invite.roomCode,
    mode: invite.mode,
    players: invite.players,
  }));

  safeSend(fromSession.ws, envelope("invite:sent", {
    inviteId,
    toPeerId: targetPeerId,
    toUserName: toSession.userName,
  }));

  return { ok: true, invite };
}

function respondInvite(actorPeerId, payload = {}) {
  const invite = invites.get(payload.inviteId);
  if (!invite || invite.status !== "pending") return { ok: false, code: "INVITE_NOT_FOUND" };
  if (invite.toPeerId !== actorPeerId) return { ok: false, code: "INVITE_FORBIDDEN" };

  const accepted = !!payload.accept;
  invite.status = accepted ? "accepted" : "rejected";
  invite.respondedAt = now();

  const fromSession = clients.get(invite.fromPeerId);
  const toSession = clients.get(invite.toPeerId);

  if (accepted && invite.roomCode && toSession) {
    applyPresence(invite.toPeerId, {
      presence: PRESENCE.IN_LOBBY,
      roomCode: invite.roomCode,
      mode: invite.mode,
    });
  }

  const evt = envelope("invite:result", {
    inviteId: invite.inviteId,
    accepted,
    fromPeerId: invite.fromPeerId,
    toPeerId: invite.toPeerId,
    roomCode: invite.roomCode,
    mode: invite.mode,
  });

  if (fromSession) safeSend(fromSession.ws, evt);
  if (toSession) safeSend(toSession.ws, evt);
  pushPresenceUpdate();
  return { ok: true, invite };
}

function handleRoomEvent(senderPeerId, payload = {}) {
  const roomCode = String(payload.roomCode || "").trim().toUpperCase();
  if (!roomCode) return;
  const room = rooms.get(roomCode);
  if (!room || !room.members.has(senderPeerId)) return;

  const out = envelope("room:event", {
    roomCode,
    fromPeer: senderPeerId,
    eventId: `${now()}-${Math.random().toString(36).slice(2, 8)}`,
    payload: payload.payload || {},
  });
  room.members.forEach((peerId) => {
    if (peerId === senderPeerId) return;
    const target = clients.get(peerId);
    if (target) safeSend(target.ws, out);
  });
}

function startMatch(senderPeerId, payload = {}) {
  const roomCode = String(payload.roomCode || "").trim().toUpperCase();
  if (!roomCode) return { ok: false, code: "ROOM_REQUIRED" };
  const room = rooms.get(roomCode);
  if (!room) return { ok: false, code: "ROOM_NOT_FOUND" };
  if (room.hostPeerId !== senderPeerId) return { ok: false, code: "HOST_REQUIRED" };

  const members = [...room.members];
  if (members.length < 2) return { ok: false, code: "NOT_ENOUGH_PLAYERS" };

  const matchId = `mt-${now()}-${Math.random().toString(36).slice(2, 8)}`;
  const match = {
    matchId,
    roomCode,
    hostPeerId: senderPeerId,
    mode: payload.mode || room.config.mode || "uno",
    players: Number(payload.players || members.length),
    members,
    state: "running",
    startedAt: now(),
  };
  matches.set(roomCode, match);

  members.forEach((peerId) => {
    applyPresence(peerId, {
      presence: PRESENCE.IN_MATCH,
      roomCode,
      mode: match.mode,
    });
  });
  pushPresenceUpdate();

  const evt = envelope("match:started", match);
  members.forEach((peerId) => {
    const target = clients.get(peerId);
    if (target) safeSend(target.ws, evt);
  });
  return { ok: true, match };
}

function endMatch(senderPeerId, payload = {}) {
  const roomCode = String(payload.roomCode || "").trim().toUpperCase();
  if (!roomCode) return { ok: false, code: "ROOM_REQUIRED" };
  const match = matches.get(roomCode);
  if (!match) return { ok: false, code: "MATCH_NOT_FOUND" };
  if (match.hostPeerId !== senderPeerId) return { ok: false, code: "HOST_REQUIRED" };

  match.state = "ended";
  match.endedAt = now();
  matches.delete(roomCode);

  match.members.forEach((peerId) => {
    applyPresence(peerId, {
      presence: PRESENCE.ONLINE,
      roomCode: null,
      mode: null,
    });
  });
  pushPresenceUpdate();

  const evt = envelope("match:ended", {
    matchId: match.matchId,
    roomCode,
    reason: payload.reason || "host-end",
  });
  match.members.forEach((peerId) => {
    const target = clients.get(peerId);
    if (target) safeSend(target.ws, evt);
  });
  return { ok: true };
}

function onClientMessage(peerId, raw) {
  let msg;
  try {
    msg = JSON.parse(raw.toString());
  } catch {
    return;
  }
  if (!msg || typeof msg !== "object") return;

  const session = clients.get(peerId);
  if (!session) return;

  const type = msg.type;
  const payload = msg.payload || {};

  if (type === "hello") {
    const nextName = String(payload.userName || session.userName || `Player-${peerId.slice(-4)}`).trim();
    if (session.userName !== nextName) {
      const oldKey = normalizeUserName(session.userName);
      if (userIndex.has(oldKey)) {
        userIndex.get(oldKey).delete(peerId);
        if (userIndex.get(oldKey).size === 0) userIndex.delete(oldKey);
      }
      session.userName = nextName;
      const newKey = normalizeUserName(nextName);
      if (!userIndex.has(newKey)) userIndex.set(newKey, new Set());
      userIndex.get(newKey).add(peerId);
    }
    session.updatedAt = now();
    safeSend(session.ws, envelope("hello:ack", {
      peerId,
      userName: session.userName,
      serverTs: now(),
    }));
    pushPresenceUpdate();
    return;
  }

  if (type === "presence:set") {
    applyPresence(peerId, payload);
    pushPresenceUpdate();
    return;
  }

  if (type === "invite:send") {
    const result = registerInvite(peerId, payload);
    if (!result.ok) {
      safeSend(session.ws, envelope("invite:error", { code: result.code, toUserName: payload.toUserName || null }));
    }
    return;
  }

  if (type === "invite:respond") {
    const result = respondInvite(peerId, payload);
    if (!result.ok) {
      safeSend(session.ws, envelope("invite:error", { code: result.code, inviteId: payload.inviteId || null }));
    }
    return;
  }

  if (type === "room:join") {
    const roomCode = String(payload.roomCode || "").trim().toUpperCase();
    if (!roomCode) return;
    applyPresence(peerId, {
      presence: PRESENCE.IN_LOBBY,
      roomCode,
      mode: payload.mode || null,
    });
    const room = upsertRoom(roomCode, payload.host ? peerId : null);
    if (room) {
      room.members.add(peerId);
      if (payload.mode) room.config.mode = payload.mode;
      if (payload.players) room.config.players = Number(payload.players) || room.config.players;
      if (typeof payload.isCompetitive === "boolean") room.config.isCompetitive = payload.isCompetitive;
      const evt = envelope("room:update", {
        roomCode,
        hostPeerId: room.hostPeerId,
        members: [...room.members],
        config: room.config,
      });
      room.members.forEach((memberId) => {
        const target = clients.get(memberId);
        if (target) safeSend(target.ws, evt);
      });
    }
    pushPresenceUpdate();
    return;
  }

  if (type === "room:leave") {
    detachFromRoom(peerId, "room-leave");
    applyPresence(peerId, { presence: PRESENCE.ONLINE, roomCode: null, mode: null });
    pushPresenceUpdate();
    return;
  }

  if (type === "room:update") {
    const roomCode = String(payload.roomCode || "").trim().toUpperCase();
    const room = rooms.get(roomCode);
    if (!room || room.hostPeerId !== peerId) return;
    if (payload.mode) room.config.mode = payload.mode;
    if (payload.players) room.config.players = Number(payload.players) || room.config.players;
    if (typeof payload.isCompetitive === "boolean") room.config.isCompetitive = payload.isCompetitive;
    const evt = envelope("room:update", {
      roomCode,
      hostPeerId: room.hostPeerId,
      members: [...room.members],
      config: room.config,
    });
    room.members.forEach((memberId) => {
      const target = clients.get(memberId);
      if (target) safeSend(target.ws, evt);
    });
    return;
  }

  if (type === "room:event") {
    handleRoomEvent(peerId, payload);
    return;
  }

  if (type === "match:start") {
    const result = startMatch(peerId, payload);
    if (!result.ok) {
      safeSend(session.ws, envelope("match:error", { code: result.code }));
    }
    return;
  }

  if (type === "match:end") {
    const result = endMatch(peerId, payload);
    if (!result.ok) {
      safeSend(session.ws, envelope("match:error", { code: result.code }));
    }
  }
}

function removeClient(peerId) {
  const session = clients.get(peerId);
  if (!session) return;

  detachFromRoom(peerId, "disconnect");

  const key = normalizeUserName(session.userName);
  if (userIndex.has(key)) {
    userIndex.get(key).delete(peerId);
    if (userIndex.get(key).size === 0) userIndex.delete(key);
  }

  clients.delete(peerId);
  pushPresenceUpdate();
}

wss.on("connection", (ws, req) => {
  const reqUrl = new URL(req.url || "/ws", `http://${req.headers.host || `localhost:${port}`}`);
  const peerId = reqUrl.searchParams.get("peerId") || `p-${Math.random().toString(36).slice(2, 10)}`;
  const userName = reqUrl.searchParams.get("userName") || `Player-${peerId.slice(-4)}`;

  const session = {
    ws,
    peerId,
    userName,
    presence: PRESENCE.ONLINE,
    roomCode: null,
    mode: null,
    connectedAt: now(),
    updatedAt: now(),
  };
  clients.set(peerId, session);

  const userKey = normalizeUserName(userName);
  if (!userIndex.has(userKey)) userIndex.set(userKey, new Set());
  userIndex.get(userKey).add(peerId);

  safeSend(ws, envelope("hello:ack", {
    peerId,
    userName,
    serverTs: now(),
  }));
  pushPresenceUpdate();

  ws.on("message", (raw) => onClientMessage(peerId, raw));
  ws.on("close", () => removeClient(peerId));
  ws.on("error", () => removeClient(peerId));
});

setInterval(() => {
  const cutoff = now() - 60000;
  clients.forEach((session, peerId) => {
    if (session.updatedAt < cutoff) {
      safeSend(session.ws, envelope("presence:ping", { ts: now() }));
    }
    if (session.ws.readyState !== session.ws.OPEN && session.ws.readyState !== session.ws.CONNECTING) {
      removeClient(peerId);
    }
  });
}, 10000).unref();

server.listen(port, () => {
  console.log(`UNO Ultra v2 dev server running at http://localhost:${port}`);
  console.log(`UNO Ultra realtime gateway active at ws://localhost:${port}/ws`);
});
