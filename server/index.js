import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { validateIntent } from './anti-cheat.js';
import { buildClientGameSnapshot } from './game-state-server.js';
import {
  buildLobbyView,
  createLobby,
  getLobby,
  joinLobby,
  leaveLobby,
  removeSocketFromAllLobbies,
  setReady,
  startLobbyGame
} from './lobby-manager.js';

const app = express();
app.use(cors());
app.get('/health', (_req, res) => res.json({ ok: true, service: 'uno-ultras-mp-server' }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// ── STRUTTURE DATI AMICI ──────────────────────────────────
const players = new Map();   // socketId → { name, socketId }
const friends = new Map();   // socketId → Set(socketId)
const requests = new Map();  // socketId → Set(socketId) richieste pendenti

function buildFriendList(socketId) {
  const myFriends = friends.get(socketId) || new Set();
  return [...myFriends].map((fId) => {
    const p = players.get(fId);
    return {
      id: fId,
      name: p?.name || '???',
      online: players.has(fId),
      inLobby: false
    };
  });
}

function ok(data) {
  return { ok: true, data };
}

function fail(error) {
  const message = error instanceof Error ? error.message : 'Errore server';
  return { ok: false, error: message };
}

function emitLobbyUpdate(code) {
  const lobby = getLobby(code);
  if (!lobby) return;
  io.to(code).emit('lobby:update', buildLobbyView(lobby));
}

io.on('connection', (socket) => {
  // ── REGISTRA GIOCATORE ──────────────────────────────────
  socket.on('player:register', ({ name }) => {
    players.set(socket.id, { name: String(name || 'Giocatore').trim(), socketId: socket.id });
    socket.data.name = String(name || 'Giocatore').trim();
  });

  // ── CERCA GIOCATORE PER NOME ────────────────────────────
  socket.on('friends:search', ({ name }, cb) => {
    const results = [];
    players.forEach((p, id) => {
      if (id !== socket.id && p.name.toLowerCase().includes(String(name || '').toLowerCase())) {
        results.push({ id, name: p.name });
      }
    });
    cb?.({ results });
  });

  // ── INVIA RICHIESTA AMICIZIA ────────────────────────────
  socket.on('friends:request', ({ targetId }, cb) => {
    const target = players.get(targetId);
    if (!target) return cb?.({ ok: false, error: 'Giocatore non trovato' });

    if (!requests.has(targetId)) requests.set(targetId, new Set());
    requests.get(targetId).add(socket.id);

    io.to(targetId).emit('friends:incoming', {
      fromId: socket.id,
      fromName: socket.data.name || 'Giocatore'
    });

    cb?.({ ok: true });
  });

  // ── ACCETTA RICHIESTA ───────────────────────────────────
  socket.on('friends:accept', ({ fromId }) => {
    if (!friends.has(socket.id)) friends.set(socket.id, new Set());
    if (!friends.has(fromId)) friends.set(fromId, new Set());

    friends.get(socket.id).add(fromId);
    friends.get(fromId).add(socket.id);

    requests.get(socket.id)?.delete(fromId);

    socket.emit('friends:list', buildFriendList(socket.id));
    io.to(fromId).emit('friends:list', buildFriendList(fromId));
    io.to(fromId).emit('friends:accepted', {
      byId: socket.id,
      byName: socket.data.name || 'Giocatore'
    });
  });

  // ── RIFIUTA RICHIESTA ───────────────────────────────────
  socket.on('friends:decline', ({ fromId }) => {
    requests.get(socket.id)?.delete(fromId);
  });

  // ── LISTA AMICI ─────────────────────────────────────────
  socket.on('friends:getList', (cb) => {
    cb?.({ friends: buildFriendList(socket.id) });
  });

  // ── INVITA IN LOBBY ─────────────────────────────────────
  socket.on('friends:inviteToLobby', ({ friendId }) => {
    const code = socket.data.lobbyCode;
    if (!code) return;
    io.to(friendId).emit('friends:lobbyInvite', {
      fromId: socket.id,
      fromName: socket.data.name || 'Giocatore',
      lobbyCode: code
    });
  });

  socket.on('lobby:create', (payload, cb) => {
    try {
      const lobby = createLobby({
        hostSocketId: socket.id,
        gameId: payload.gameId,
        maxPlayers: payload.maxPlayers,
        playerName: payload.playerName?.trim() || 'Host'
      });

      socket.join(lobby.code);
      socket.data.lobbyCode = lobby.code;
      cb(ok(buildLobbyView(lobby)));
      emitLobbyUpdate(lobby.code);
    } catch (error) {
      cb(fail(error));
    }
  });

  socket.on('lobby:join', (payload, cb) => {
    try {
      const lobby = joinLobby({
        code: payload.code,
        socketId: socket.id,
        playerName: payload.playerName?.trim() || 'Giocatore'
      });

      socket.join(lobby.code);
      socket.data.lobbyCode = lobby.code;
      cb(ok(buildLobbyView(lobby)));
      emitLobbyUpdate(lobby.code);
    } catch (error) {
      cb(fail(error));
    }
  });

  socket.on('lobby:leave', (payload, cb) => {
    try {
      const code = String(payload.code || '').toUpperCase();
      const lobby = leaveLobby({ code, socketId: socket.id });
      socket.leave(code);
      socket.data.lobbyCode = null;
      cb(ok({ ok: true }));
      if (lobby) {
        emitLobbyUpdate(code);
      }
    } catch (error) {
      cb(fail(error));
    }
  });

  socket.on('lobby:ready', (payload, cb) => {
    try {
      const lobby = setReady({ code: payload.code, socketId: socket.id, ready: payload.ready });
      cb(ok({ ok: true }));
      emitLobbyUpdate(lobby.code);
    } catch (error) {
      cb(fail(error));
    }
  });

  socket.on('lobby:start', (payload, cb) => {
    try {
      const lobby = startLobbyGame({ code: payload.code, socketId: socket.id });
      cb(ok({ started: true }));
      emitLobbyUpdate(lobby.code);
      for (const player of lobby.players) {
        io.to(player.socketId).emit('game:start', {
          gameId: lobby.gameId,
          playersCount: lobby.players.length,
          initialState: buildClientGameSnapshot(lobby.gameState, player.socketId, lobby.players)
        });
      }
    } catch (error) {
      cb(fail(error));
    }
  });

  socket.on('game:intent', (payload, cb) => {
    const valid = validateIntent({ action: payload.action, payload: payload.body });
    if (!valid.ok) {
      cb(fail(valid.reason));
      return;
    }
    cb(ok({ accepted: true }));
  });

  socket.on('disconnect', () => {
    // Lobby cleanup
    const updates = removeSocketFromAllLobbies(socket.id);
    updates.forEach(({ code, lobby }) => {
      if (lobby) emitLobbyUpdate(code);
    });

    // Friends cleanup — remove from players map; friends stay in list but show offline
    players.delete(socket.id);
    requests.delete(socket.id);
  });
});

const port = Number(process.env.PORT ?? 3001);
httpServer.listen(port, () => {
  console.log(`[mp-server] listening on :${port}`);
});
