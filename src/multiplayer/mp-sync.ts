import type { GameId } from '../game/types';
import { connectSocket, getSocket } from './socket-client';
import { getLobbyState, setLobbyRoom, updateLobbyState, type LobbyRoomView } from './lobby-state';

type AckOk<T> = { ok: true; data: T };
type AckErr = { ok: false; error: string };
type Ack<T> = AckOk<T> | AckErr;

function normalizeSocketError(error: unknown): Error {
  const raw = error instanceof Error ? error.message : String(error ?? '');
  const msg = raw.toLowerCase();

  if (msg.includes('websocket error') || msg.includes('xhr poll error') || msg.includes('connect_error')) {
    return new Error('Server online non raggiungibile. Avvia il server multiplayer e riprova.');
  }

  return error instanceof Error ? error : new Error('Errore di connessione multiplayer.');
}

async function emitAck<TReq, TRes>(event: string, payload: TReq): Promise<TRes> {
  try {
    await connectSocket();
  } catch (error) {
    throw normalizeSocketError(error);
  }
  const socket = getSocket();
  return new Promise((resolve, reject) => {
    socket.timeout(5000).emit(event, payload, (err: Error | null, res: Ack<TRes>) => {
      if (err) {
        reject(new Error('Timeout multiplayer server.'));
        return;
      }
      if (!res.ok) {
        reject(new Error(res.error));
        return;
      }
      resolve(res.data);
    });
  });
}

export interface MultiplayerHandlers {
  onGameStart: (gameId: GameId, playersCount: number, initialState?: unknown) => void;
  onNotify: (text: string) => void;
}

let initialized = false;

export function initMultiplayerSync(handlers: MultiplayerHandlers): void {
  if (initialized) return;
  initialized = true;

  const socket = getSocket();
  // Non connettiamo all'avvio: la connessione avviene on-demand quando
  // l'utente crea/si unisce a una lobby (tramite emitAck → connectSocket).

  socket.on('connect', () => {
    updateLobbyState({ connected: true, status: 'Connesso online', selfId: socket.id ?? null, error: null });
  });

  socket.on('disconnect', () => {
    updateLobbyState({ connected: false, status: 'Disconnesso', room: null });
  });

  socket.on('lobby:update', (room: LobbyRoomView) => {
    setLobbyRoom(room);
    updateLobbyState({ view: 'room', status: `Lobby ${room.code}`, error: null });
  });

  socket.on('lobby:error', (message: string) => {
    updateLobbyState({ error: message });
    handlers.onNotify(message);
  });

  socket.on('game:start', (payload: { gameId: GameId; playersCount?: number; initialState?: unknown }) => {
    updateLobbyState({ status: 'Partita avviata', error: null });
    handlers.onNotify('Partita online avviata.');
    handlers.onGameStart(payload.gameId, payload.playersCount ?? 2, payload.initialState);
  });
}

export async function createLobbyOnline(payload: { gameId: GameId; playerName: string }): Promise<void> {
  const room = await emitAck<typeof payload, LobbyRoomView>('lobby:create', payload);
  setLobbyRoom(room);
  updateLobbyState({ view: 'room', error: null, status: `Lobby ${room.code}` });
}

export async function joinLobbyOnline(payload: { code: string; playerName: string }): Promise<void> {
  const room = await emitAck<typeof payload, LobbyRoomView>('lobby:join', payload);
  setLobbyRoom(room);
  updateLobbyState({ view: 'room', error: null, status: `Lobby ${room.code}` });
}

export async function leaveLobbyOnline(): Promise<void> {
  const roomCode = getLobbyState().room?.code;
  if (!roomCode) return;
  await emitAck<{ code: string }, { ok: true }>('lobby:leave', { code: roomCode });
  updateLobbyState({ room: null, view: 'menu', status: 'Lobby chiusa' });
}

export async function startOnlineGame(): Promise<void> {
  const roomCode = getLobbyState().room?.code;
  if (!roomCode) throw new Error('Nessuna lobby attiva');
  await emitAck<{ code: string }, { started: true }>('lobby:start', { code: roomCode });
}

export async function setOnlineReady(ready: boolean): Promise<void> {
  const roomCode = getLobbyState().room?.code;
  if (!roomCode) return;
  await emitAck<{ code: string; ready: boolean }, { ok: true }>('lobby:ready', { code: roomCode, ready });
}
