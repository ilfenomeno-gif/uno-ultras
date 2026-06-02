import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { GameId } from '../src/game/types';
import { validateIntent } from './anti-cheat';
import { buildClientGameSnapshot } from './game-state-server';
import {
  buildLobbyView,
  createLobby,
  getLobby,
  joinLobby,
  leaveLobby,
  removeSocketFromAllLobbies,
  setReady,
  startLobbyGame
} from './lobby-manager';

const app = express();
app.use(cors());
app.get('/health', (_req, res) => res.json({ ok: true, service: 'uno-ultras-mp-server' }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});

function ok<T>(data: T) {
  return { ok: true as const, data };
}

function fail(error: unknown) {
  const message = error instanceof Error ? error.message : 'Errore server';
  return { ok: false as const, error: message };
}

function emitLobbyUpdate(code: string): void {
  const lobby = getLobby(code);
  if (!lobby) return;
  io.to(code).emit('lobby:update', buildLobbyView(lobby));
}

io.on('connection', (socket) => {
  socket.on(
    'lobby:create',
    (payload: { gameId: GameId; maxPlayers: number; playerName: string }, cb: (res: ReturnType<typeof ok> | ReturnType<typeof fail>) => void) => {
      try {
        const lobby = createLobby({
          hostSocketId: socket.id,
          gameId: payload.gameId,
          maxPlayers: payload.maxPlayers,
          playerName: payload.playerName?.trim() || 'Host'
        });

        socket.join(lobby.code);
        cb(ok(buildLobbyView(lobby)));
        emitLobbyUpdate(lobby.code);
      } catch (error) {
        cb(fail(error));
      }
    }
  );

  socket.on('lobby:join', (payload: { code: string; playerName: string }, cb: (res: ReturnType<typeof ok> | ReturnType<typeof fail>) => void) => {
    try {
      const lobby = joinLobby({
        code: payload.code,
        socketId: socket.id,
        playerName: payload.playerName?.trim() || 'Giocatore'
      });

      socket.join(lobby.code);
      cb(ok(buildLobbyView(lobby)));
      emitLobbyUpdate(lobby.code);
    } catch (error) {
      cb(fail(error));
    }
  });

  socket.on('lobby:leave', (payload: { code: string }, cb: (res: ReturnType<typeof ok> | ReturnType<typeof fail>) => void) => {
    try {
      const code = payload.code.toUpperCase();
      const lobby = leaveLobby({ code, socketId: socket.id });
      socket.leave(code);
      cb(ok({ ok: true }));
      if (lobby) {
        emitLobbyUpdate(code);
      }
    } catch (error) {
      cb(fail(error));
    }
  });

  socket.on('lobby:ready', (payload: { code: string; ready: boolean }, cb: (res: ReturnType<typeof ok> | ReturnType<typeof fail>) => void) => {
    try {
      const lobby = setReady({ code: payload.code, socketId: socket.id, ready: payload.ready });
      cb(ok({ ok: true }));
      emitLobbyUpdate(lobby.code);
    } catch (error) {
      cb(fail(error));
    }
  });

  socket.on('lobby:start', (payload: { code: string }, cb: (res: ReturnType<typeof ok> | ReturnType<typeof fail>) => void) => {
    try {
      const lobby = startLobbyGame({ code: payload.code, socketId: socket.id });
      cb(ok({ started: true }));
      emitLobbyUpdate(lobby.code);
      for (const player of lobby.players) {
        io.to(player.socketId).emit('game:start', {
          gameId: lobby.gameId,
          playersCount: lobby.players.length,
          initialState: buildClientGameSnapshot(lobby.gameState!, player.socketId, lobby.players)
        });
      }
    } catch (error) {
      cb(fail(error));
    }
  });

  socket.on('game:intent', (payload: { code: string; action: string; body?: Record<string, unknown> }, cb: (res: ReturnType<typeof ok> | ReturnType<typeof fail>) => void) => {
    const valid = validateIntent({ action: payload.action, payload: payload.body });
    if (!valid.ok) {
      cb(fail(valid.reason));
      return;
    }
    cb(ok({ accepted: true }));
  });

  socket.on('disconnect', () => {
    const updates = removeSocketFromAllLobbies(socket.id);
    updates.forEach(({ code, lobby }) => {
      if (lobby) emitLobbyUpdate(code);
    });
  });
});

const port = Number(process.env.PORT ?? 3001);
httpServer.listen(port, () => {
  console.log(`[mp-server] listening on :${port}`);
});
