import type { GameId } from '../src/game/types';
import { createInitialServerGameState, type ServerGameState } from './game-state-server';

export interface LobbyPlayer {
  socketId: string;
  name: string;
  ready: boolean;
}

export interface Lobby {
  code: string;
  hostSocketId: string;
  gameId: GameId;
  players: LobbyPlayer[];
  maxPlayers: number;
  state: 'waiting' | 'in-game' | 'finished';
  gameState?: ServerGameState;
}

export interface LobbyViewPlayer {
  id: string;
  name: string;
  ready: boolean;
  isHost: boolean;
}

export interface LobbyView {
  code: string;
  gameId: GameId;
  maxPlayers: number;
  state: 'waiting' | 'in-game' | 'finished';
  players: LobbyViewPlayer[];
}

const lobbies = new Map<string, Lobby>();

function randomCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function generateUniqueCode(): string {
  let code = randomCode();
  while (lobbies.has(code)) {
    code = randomCode();
  }
  return code;
}

export function buildLobbyView(lobby: Lobby): LobbyView {
  return {
    code: lobby.code,
    gameId: lobby.gameId,
    maxPlayers: lobby.maxPlayers,
    state: lobby.state,
    players: lobby.players.map((player) => ({
      id: player.socketId,
      name: player.name,
      ready: player.ready,
      isHost: player.socketId === lobby.hostSocketId
    }))
  };
}

export function createLobby(payload: { hostSocketId: string; playerName: string; gameId: GameId; maxPlayers: number }): Lobby {
  const code = generateUniqueCode();
  const lobby: Lobby = {
    code,
    hostSocketId: payload.hostSocketId,
    gameId: payload.gameId,
    players: [
      {
        socketId: payload.hostSocketId,
        name: payload.playerName,
        ready: true
      }
    ],
    maxPlayers: Math.max(2, Math.min(4, payload.maxPlayers)),
    state: 'waiting'
  };

  lobbies.set(code, lobby);
  return lobby;
}

export function getLobby(code: string): Lobby | null {
  return lobbies.get(code.toUpperCase()) ?? null;
}

export function joinLobby(payload: { code: string; socketId: string; playerName: string }): Lobby {
  const lobby = getLobby(payload.code);
  if (!lobby) throw new Error('Lobby non trovata');
  if (lobby.state !== 'waiting') throw new Error('La lobby e gia in partita');
  if (lobby.players.length >= lobby.maxPlayers) throw new Error('Lobby piena');
  if (lobby.players.some((p) => p.socketId === payload.socketId)) return lobby;

  lobby.players.push({
    socketId: payload.socketId,
    name: payload.playerName,
    ready: false
  });

  return lobby;
}

export function leaveLobby(payload: { code: string; socketId: string }): Lobby | null {
  const lobby = getLobby(payload.code);
  if (!lobby) return null;

  lobby.players = lobby.players.filter((player) => player.socketId !== payload.socketId);

  if (lobby.players.length === 0) {
    lobbies.delete(lobby.code);
    return null;
  }

  if (lobby.hostSocketId === payload.socketId) {
    lobby.hostSocketId = lobby.players[0]?.socketId ?? lobby.hostSocketId;
    if (lobby.players[0]) lobby.players[0].ready = true;
  }

  return lobby;
}

export function setReady(payload: { code: string; socketId: string; ready: boolean }): Lobby {
  const lobby = getLobby(payload.code);
  if (!lobby) throw new Error('Lobby non trovata');
  const player = lobby.players.find((p) => p.socketId === payload.socketId);
  if (!player) throw new Error('Giocatore non presente in lobby');
  player.ready = payload.ready;
  return lobby;
}

export function startLobbyGame(payload: { code: string; socketId: string }): Lobby {
  const lobby = getLobby(payload.code);
  if (!lobby) throw new Error('Lobby non trovata');
  if (lobby.hostSocketId !== payload.socketId) throw new Error('Solo host puo avviare la partita');
  if (lobby.players.length < 2) throw new Error('Servono almeno 2 giocatori per iniziare');

  lobby.state = 'in-game';
  lobby.gameState = createInitialServerGameState(lobby.gameId, lobby.players);
  return lobby;
}

export function removeSocketFromAllLobbies(socketId: string): Array<{ code: string; lobby: Lobby | null }> {
  const updates: Array<{ code: string; lobby: Lobby | null }> = [];
  for (const [code, lobby] of lobbies.entries()) {
    const hasPlayer = lobby.players.some((player) => player.socketId === socketId);
    if (!hasPlayer) continue;
    const nextLobby = leaveLobby({ code, socketId });
    updates.push({ code, lobby: nextLobby });
  }
  return updates;
}
