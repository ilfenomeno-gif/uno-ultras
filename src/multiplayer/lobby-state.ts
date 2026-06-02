import type { GameId } from '../game/types';

export type LobbyView = 'menu' | 'create' | 'join' | 'room';

export interface LobbyPlayerView {
  id: string;
  name: string;
  ready: boolean;
  isHost: boolean;
}

export interface LobbyRoomView {
  code: string;
  gameId: GameId;
  maxPlayers: number;
  state: 'waiting' | 'in-game' | 'finished';
  players: LobbyPlayerView[];
}

export interface LobbyState {
  visible: boolean;
  connected: boolean;
  view: LobbyView;
  status: string;
  error: string | null;
  joinCode: string;
  room: LobbyRoomView | null;
  selfId: string | null;
}

const defaultState: LobbyState = {
  visible: false,
  connected: false,
  view: 'menu',
  status: 'Disconnesso',
  error: null,
  joinCode: '',
  room: null,
  selfId: null
};

let state: LobbyState = { ...defaultState };
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function getLobbyState(): LobbyState {
  return state;
}

export function subscribeLobbyState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateLobbyState(patch: Partial<LobbyState>): void {
  state = { ...state, ...patch };
  emit();
}

export function setLobbyRoom(room: LobbyRoomView | null): void {
  state = {
    ...state,
    room,
    view: room ? 'room' : state.view,
    error: null
  };
  emit();
}

export function setLobbyJoinCode(value: string): void {
  state = { ...state, joinCode: value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) };
  emit();
}

export function showLobby(view: LobbyView = 'menu'): void {
  state = { ...state, visible: true, view, error: null };
  emit();
}

export function hideLobby(): void {
  state = { ...state, visible: false, view: 'menu', room: null, error: null, status: defaultState.status };
  emit();
}

export function resetLobbyState(): void {
  state = { ...defaultState };
  emit();
}
