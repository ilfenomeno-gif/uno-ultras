import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;
let pendingConnect: Promise<void> | null = null;

function resolveServerUrl(): string {
  const env = (import.meta as any).env ?? {};
  return env.VITE_SERVER_URL ?? env.VITE_MP_SERVER_URL ?? 'http://localhost:3001';
}

export function getSocket(): Socket {
  if (socket) return socket;

  socket = io(resolveServerUrl(), {
    autoConnect: false,
    transports: ['websocket', 'polling']
  });

  return socket;
}

export function connectSocket(): Promise<void> {
  const s = getSocket();
  if (s.connected) {
    return Promise.resolve();
  }

  if (pendingConnect) {
    return pendingConnect;
  }

  pendingConnect = new Promise((resolve, reject) => {
    let lastError: Error | null = null;

    const onConnect = () => {
      cleanup();
      resolve();
    };

    const onError = (err: Error) => {
      // Non falliamo al primo errore: lasciamo tempo al client di completare
      // fallback/riconnessione e chiudiamo solo al timeout.
      lastError = err;
    };

    const timer = globalThis.setTimeout(() => {
      cleanup();
      reject(lastError ?? new Error('Impossibile connettersi al server multiplayer.'));
    }, 7000);

    const cleanup = () => {
      globalThis.clearTimeout(timer);
      s.off('connect', onConnect);
      s.off('connect_error', onError);
      pendingConnect = null;
    };

    s.on('connect', onConnect);
    s.on('connect_error', onError);
    s.connect();
  });

  return pendingConnect;
}

export function disconnectSocket(): void {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
