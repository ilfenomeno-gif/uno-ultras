// src/multiplayer/friends.ts
import { getSocket } from './socket-client';
import { notify } from '../core/notify';
import { findAccountById, getActiveAccount, listAccountsWithProfiles } from '../core/store';

export interface Friend {
  id: string;
  name: string;
  online: boolean;
  inLobby: boolean;
}

type LocalFriendRequest = {
  id: string;
  fromId: string;
  toId: string;
  fromName: string;
  createdAt: number;
};

type SocialDb = {
  version: 1;
  friendsByAccount: Record<string, string[]>;
  requests: LocalFriendRequest[];
};

const SOCIAL_DB_KEY = 'uno-ultras-definitivo-social-db-v1';

export let friendList: Friend[] = [];
export let pendingRequests: { fromId: string; fromName: string }[] = [];
let knownPendingIds = new Set<string>();

function loadSocialDb(): SocialDb {
  try {
    const raw = localStorage.getItem(SOCIAL_DB_KEY);
    if (!raw) {
      return { version: 1, friendsByAccount: {}, requests: [] };
    }
    const parsed = JSON.parse(raw) as Partial<SocialDb>;
    if (parsed.version !== 1) {
      return { version: 1, friendsByAccount: {}, requests: [] };
    }
    return {
      version: 1,
      friendsByAccount: parsed.friendsByAccount && typeof parsed.friendsByAccount === 'object' ? parsed.friendsByAccount : {},
      requests: Array.isArray(parsed.requests) ? parsed.requests : []
    };
  } catch {
    return { version: 1, friendsByAccount: {}, requests: [] };
  }
}

function saveSocialDb(db: SocialDb): void {
  localStorage.setItem(SOCIAL_DB_KEY, JSON.stringify(db));
}

function getActiveAccountId(): string | null {
  return getActiveAccount()?.id ?? null;
}

function buildLocalFriends(activeAccountId: string): Friend[] {
  const db = loadSocialDb();
  const currentLinks = db.friendsByAccount[activeAccountId] ?? [];
  const byId = new Map(listAccountsWithProfiles().map((account) => [account.id, account]));
  return currentLinks
    .map((friendId) => {
      const account = byId.get(friendId);
      if (!account) return null;
      return {
        id: account.id,
        name: account.displayName,
        online: false,
        inLobby: false
      } satisfies Friend;
    })
    .filter((friend): friend is Friend => Boolean(friend));
}

function refreshLocalSocialState(showToasts = true): void {
  const activeAccountId = getActiveAccountId();
  if (!activeAccountId) {
    friendList = [];
    pendingRequests = [];
    knownPendingIds = new Set();
    _onFriendsUpdate?.();
    return;
  }

  const db = loadSocialDb();
  friendList = buildLocalFriends(activeAccountId);

  const incoming = db.requests.filter((request) => request.toId === activeAccountId);
  pendingRequests = incoming.map((request) => ({ fromId: request.fromId, fromName: request.fromName }));

  const nextKnown = new Set(incoming.map((request) => request.id));
  if (showToasts) {
    for (const request of incoming) {
      if (!knownPendingIds.has(request.id)) {
        notify(`📩 ${request.fromName} ti ha mandato una richiesta di amicizia`);
        renderFriendRequestToast({ fromId: request.fromId, fromName: request.fromName });
      }
    }
  }
  knownPendingIds = nextKnown;
  _onFriendsUpdate?.();
}

function refreshLocalPendingOnly(showToasts = true): void {
  const activeAccountId = getActiveAccountId();
  if (!activeAccountId) {
    pendingRequests = [];
    knownPendingIds = new Set();
    _onFriendsUpdate?.();
    return;
  }

  const db = loadSocialDb();
  const incoming = db.requests.filter((request) => request.toId === activeAccountId);
  pendingRequests = incoming.map((request) => ({ fromId: request.fromId, fromName: request.fromName }));

  const nextKnown = new Set(incoming.map((request) => request.id));
  if (showToasts) {
    for (const request of incoming) {
      if (!knownPendingIds.has(request.id)) {
        notify(`📩 ${request.fromName} ti ha mandato una richiesta di amicizia`);
        renderFriendRequestToast({ fromId: request.fromId, fromName: request.fromName });
      }
    }
  }
  knownPendingIds = nextKnown;
  _onFriendsUpdate?.();
}

let _onFriendsUpdate: (() => void) | null = null;
export function setFriendsUpdateCallback(fn: () => void): void {
  _onFriendsUpdate = fn;
}

export function setupFriendListeners(): void {
  const s = getSocket();

  // Aggiornamento lista amici dal server
  s.on('friends:list', (data: { friends: Friend[] }) => {
    friendList = data.friends;
    _onFriendsUpdate?.();
  });

  // Richiesta amicizia in arrivo
  s.on('friends:incoming', (req: { fromId: string; fromName: string }) => {
    pendingRequests.push(req);
    notify(`📩 ${req.fromName} ti ha mandato una richiesta di amicizia`);
    renderFriendRequestToast(req);
    _onFriendsUpdate?.();
  });

  // Amicizia accettata
  s.on('friends:accepted', ({ byName }: { byId: string; byName: string }) => {
    notify(`✅ ${byName} ha accettato la tua richiesta!`);
    loadFriendList();
    _onFriendsUpdate?.();
  });

  // Invito lobby in arrivo
  s.on('friends:lobbyInvite', ({ fromName, lobbyCode }: { fromId: string; fromName: string; lobbyCode: string }) => {
    renderLobbyInviteToast(fromName, lobbyCode);
  });

  s.on('connect', () => {
    loadFriendList();
  });

  // Fallback locale sempre disponibile (anche senza server online).
  refreshLocalSocialState(false);
}

// ── CERCA GIOCATORE ──────────────────────────────────────
export function searchPlayers(name: string): Promise<{ id: string; name: string }[]> {
  const term = name.trim().toLowerCase();
  if (!term) return Promise.resolve([]);

  const activeAccountId = getActiveAccountId();
  const localMatches = listAccountsWithProfiles()
    .filter((account) => account.id !== activeAccountId)
    .filter((account) => account.displayName.toLowerCase().includes(term))
    .map((account) => ({ id: account.id, name: account.displayName }));

  const socket = getSocket();
  if (!socket.connected) {
    return Promise.resolve(localMatches);
  }

  return new Promise((resolve) => {
    socket.emit('friends:search', { name }, (res: { results: { id: string; name: string }[] }) => {
      const remote = res?.results || [];
      if (remote.length === 0) {
        resolve(localMatches);
        return;
      }
      const merged = [...remote];
      for (const local of localMatches) {
        if (!merged.some((entry) => entry.id === local.id)) {
          merged.push(local);
        }
      }
      resolve(merged);
    });
  });
}

// ── INVIA RICHIESTA ──────────────────────────────────────
export function sendFriendRequest(targetId: string): Promise<void> {
  const activeAccount = getActiveAccount();
  const activeAccountId = activeAccount?.id;
  if (!activeAccountId) {
    return Promise.reject(new Error('Accedi prima di inviare richieste amicizia.'));
  }

  const db = loadSocialDb();
  const alreadyFriend = (db.friendsByAccount[activeAccountId] ?? []).includes(targetId);
  if (alreadyFriend) {
    return Promise.reject(new Error('Siete gia amici.'));
  }

  const duplicateRequest = db.requests.some((request) => request.fromId === activeAccountId && request.toId === targetId);
  if (duplicateRequest) {
    return Promise.reject(new Error('Richiesta gia inviata.'));
  }

  const targetAccount = findAccountById(targetId);
  if (!targetAccount) {
    return Promise.reject(new Error('Giocatore non trovato nei profili registrati.'));
  }

  const pushLocalRequest = () => {
    db.requests.push({
      id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      fromId: activeAccountId,
      toId: targetId,
      fromName: activeAccount.displayName || 'Giocatore',
      createdAt: Date.now()
    });
    saveSocialDb(db);
    notify(`Richiesta inviata a ${targetAccount.displayName}.`);
    refreshLocalSocialState(false);
  };

  const socket = getSocket();
  if (!socket.connected) {
    pushLocalRequest();
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    socket.emit('friends:request', { targetId }, (res: { ok: boolean; error?: string }) => {
      if (res?.ok) {
        notify('Richiesta inviata!');
        pushLocalRequest();
        resolve();
      } else {
        pushLocalRequest();
        resolve();
      }
    });
  });
}

// ── ACCETTA / RIFIUTA ────────────────────────────────────
export function acceptRequest(fromId: string): void {
  const activeAccountId = getActiveAccountId();
  if (activeAccountId) {
    const db = loadSocialDb();
    const request = db.requests.find((entry) => entry.fromId === fromId && entry.toId === activeAccountId);
    if (request) {
      db.requests = db.requests.filter((entry) => entry.id !== request.id);
      const mine = new Set(db.friendsByAccount[activeAccountId] ?? []);
      const other = new Set(db.friendsByAccount[fromId] ?? []);
      mine.add(fromId);
      other.add(activeAccountId);
      db.friendsByAccount[activeAccountId] = [...mine];
      db.friendsByAccount[fromId] = [...other];
      saveSocialDb(db);
      refreshLocalSocialState(false);
    }
  }

  pendingRequests = pendingRequests.filter((r) => r.fromId !== fromId);
  const socket = getSocket();
  if (socket.connected) {
    socket.emit('friends:accept', { fromId });
  }
  notify('Richiesta accettata.');
}

export function declineRequest(fromId: string): void {
  const activeAccountId = getActiveAccountId();
  if (activeAccountId) {
    const db = loadSocialDb();
    db.requests = db.requests.filter((entry) => !(entry.fromId === fromId && entry.toId === activeAccountId));
    saveSocialDb(db);
    refreshLocalSocialState(false);
  }

  pendingRequests = pendingRequests.filter((r) => r.fromId !== fromId);
  const socket = getSocket();
  if (socket.connected) {
    socket.emit('friends:decline', { fromId });
  }
  notify('Richiesta rifiutata.');
}

// ── INVITA IN LOBBY ──────────────────────────────────────
export function inviteFriendToLobby(friendId: string): void {
  const socket = getSocket();
  if (socket.connected) {
    socket.emit('friends:inviteToLobby', { friendId });
    notify('Invito inviato!');
    return;
  }

  notify('Modalita online non attiva: passo alla lobby online per inviare l invito.');
}

// ── CARICA LISTA ─────────────────────────────────────────
export function loadFriendList(): void {
  const s = getSocket();
  if (!s.connected) {
    refreshLocalSocialState();
    return;
  }
  s.emit('friends:getList', (res: { friends: Friend[] }) => {
    const remote = res?.friends || [];
    const local = buildLocalFriends(getActiveAccountId() ?? '');
    const merged = [...remote];
    for (const friend of local) {
      if (!merged.some((entry) => entry.id === friend.id)) {
        merged.push(friend);
      }
    }
    friendList = merged;
    refreshLocalPendingOnly();
    _onFriendsUpdate?.();
  });
}

// ── REGISTRA NOME SUL SERVER ─────────────────────────────
export function registerPlayer(name: string): void {
  const s = getSocket();
  if (!s.connected) return;
  s.emit('player:register', { name: name.trim() || 'Giocatore' });
}

// ── PANNELLO AMICI HTML ──────────────────────────────────
export function renderFriendsPanel(): string {
  return `
  <div class="fn-friends-panel" id="fn-friends-panel">
    <div class="fn-friends-header">
      <h3>AMICI ONLINE <span class="fn-friends-count">${friendList.length}</span></h3>
      <button class="btn-ghost fn-friends-add-btn" data-action="friends-open-search">+ AGGIUNGI</button>
    </div>

    <div class="fn-friends-list">
      ${
        friendList.length === 0
          ? `<p class="fn-friends-empty">Nessun amico ancora.<br>Cercane uno per nome!</p>`
          : friendList
              .map(
                (f) => `
        <div class="fn-friend-row">
          <div class="fn-friend-avatar ${f.online ? 'online' : 'offline'}">
            ${f.name.charAt(0).toUpperCase()}
          </div>
          <div class="fn-friend-info">
            <strong>${f.name}</strong>
            <span>${f.online ? '🟢 Online' : '⚫ Offline'}</span>
          </div>
          ${
            f.online
              ? `<button class="btn-ghost fn-friend-invite-btn"
                         data-action="friend-invite"
                         data-friend-id="${f.id}">INVITA</button>`
              : ''
          }
        </div>
      `
              )
              .join('')
      }
    </div>

    <!-- CERCA NUOVO AMICO -->
    <div class="fn-friends-search" id="fn-friends-search" style="display:none">
      <input id="fn-friend-search-input" type="text"
             placeholder="Nome giocatore..." class="fn-lobby-code-input" />
      <button class="btn-primary" data-action="friends-do-search">CERCA</button>
      <div id="fn-friend-search-results"></div>
    </div>
  </div>`;
}

// ── TOAST RICHIESTA AMICIZIA ─────────────────────────────
function renderFriendRequestToast(req: { fromId: string; fromName: string }): void {
  const div = document.createElement('div');
  div.className = 'fn-friend-toast';
  div.innerHTML = `
    <div class="fn-friend-toast-body">
      <strong>${escapeHtml(req.fromName)}</strong> vuole essere tuo amico
    </div>
    <div class="fn-friend-toast-actions">
      <button class="btn-primary fn-ft-accept" style="font-size:12px;padding:6px 14px">✅ ACCETTA</button>
      <button class="btn-ghost fn-ft-decline" style="font-size:12px;padding:6px 14px">❌ RIFIUTA</button>
    </div>`;

  div.querySelector('.fn-ft-accept')!.addEventListener('click', () => {
    acceptRequest(req.fromId);
    div.remove();
  });
  div.querySelector('.fn-ft-decline')!.addEventListener('click', () => {
    declineRequest(req.fromId);
    div.remove();
  });

  document.body.appendChild(div);
  setTimeout(() => div.remove(), 15000);
}

// ── TOAST INVITO LOBBY ───────────────────────────────────
function renderLobbyInviteToast(fromName: string, code: string): void {
  const div = document.createElement('div');
  div.className = 'fn-friend-toast';
  div.innerHTML = `
    <div class="fn-friend-toast-body">
      <strong>${escapeHtml(fromName)}</strong> ti invita nella sua lobby
      <br><span class="fn-lobby-code-pill">${escapeHtml(code)}</span>
    </div>
    <div class="fn-friend-toast-actions">
      <button class="btn-primary fn-ft-join" style="font-size:12px;padding:6px 14px">🎮 ENTRA</button>
      <button class="btn-ghost fn-ft-deny" style="font-size:12px;padding:6px 14px">✕ IGNORA</button>
    </div>`;

  div.querySelector('.fn-ft-join')!.addEventListener('click', () => {
    import('./mp-sync').then(({ joinLobbyOnline }) => {
      const name = (window as Window & { __profile?: { name?: string } }).__profile?.name || 'Giocatore';
      joinLobbyOnline({ code, playerName: name })
        .then(() => { notify('Entrato nella lobby!'); div.remove(); })
        .catch((e: Error) => { notify(e.message); div.remove(); });
    });
  });
  div.querySelector('.fn-ft-deny')!.addEventListener('click', () => div.remove());

  document.body.appendChild(div);
  setTimeout(() => div.remove(), 20000);
}

// ── SICUREZZA: escape HTML ───────────────────────────────
function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
