import type { GameId } from '../game/types';
import { getLobbyState } from '../multiplayer/lobby-state';
import { friendList } from '../multiplayer/friends';

function formatCode(code: string): string {
  const clean = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  if (clean.length <= 3) return clean;
  return `${clean.slice(0, 3)}-${clean.slice(3, 6)}`;
}

function playerRoleLabel(isHost: boolean, ready: boolean): string {
  if (isHost) return 'HOST ★';
  return ready ? 'PRONTO' : 'IN ATTESA';
}

export function renderLobbyScreen(selectedGameId: GameId, defaultName: string): string {
  const state = getLobbyState();
  const room = state.room;

  if (!room && (state.view === 'menu' || state.view === 'create')) {
    return `
      <section class="fn-lobby-screen">
        <header class="fn-lobby-head">
          <h2>LOBBY ONLINE</h2>
          <p>${state.connected ? 'Scegli come entrare online' : 'Connessione in corso...'}</p>
        </header>

        <div class="fn-lobby-menu-big-actions">
          <button class="fn-lobby-big-btn" data-action="online-menu-create">CREA LOBBY</button>
          <button class="fn-lobby-big-btn" data-action="online-menu-join">UNISCITI</button>
        </div>

        <footer class="fn-lobby-foot">Giocatore: <strong>${defaultName || 'Giocatore'}</strong> · Modalita selezionata: <strong>${selectedGameId.toUpperCase()}</strong></footer>
        <div class="fn-lobby-menu-actions fn-lobby-menu-actions-start">
          <button class="btn-ghost" data-action="online-open-mode-picker">SCEGLI MODALITA</button>
        </div>
      </section>
    `;
  }

  if (!room && state.view === 'join') {
    const friendRows = friendList.length
      ? friendList
          .map((friend) => {
            const open = friend.online && friend.inLobby;
            const quickCode = friend.id.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6).padEnd(6, 'X');
            return `
              <div class="fn-join-friend-row ${open ? 'open' : 'closed'}">
                <div>
                  <strong>${friend.name}</strong>
                  <span>${open ? 'Lobby aperta' : 'Lobby chiusa'}</span>
                </div>
                <button class="btn-ghost" ${open ? `data-action="online-quick-join" data-code="${quickCode}"` : 'disabled'}>${open ? 'ENTRA SUBITO' : 'CHIUSA'}</button>
              </div>
            `;
          })
          .join('')
      : '<p class="fn-lobby-foot">Nessun amico disponibile al momento.</p>';

    return `
      <section class="fn-lobby-screen fn-lobby-join-screen">
        <header class="fn-lobby-head">
          <h2>UNISCITI A LOBBY</h2>
          <p>Inserisci codice o scegli una lobby aperta dei tuoi amici.</p>
        </header>

        <div class="fn-lobby-join-row fn-lobby-join-row-wide">
          <input class="fn-lobby-code-input" data-online-field="join-code" value="${state.joinCode}" maxlength="6" placeholder="AB3K7X" aria-label="Codice lobby" />
          <button class="fn-lobby-big-btn" data-action="online-join">UNISCITI ORA</button>
        </div>

        <div class="fn-join-friends-list">${friendRows}</div>

        <div class="fn-lobby-menu-actions fn-lobby-menu-actions-start">
          <button class="btn-ghost" data-action="online-back-menu">TORNA AL MENU ONLINE</button>
        </div>
      </section>
    `;
  }

  const selfId = state.selfId;
  const selfPlayer = room.players.find((p) => p.id === selfId);
  const selfIsHost = Boolean(selfPlayer?.isHost);
  const code = formatCode(room.code);
  const players = room.players
    .map(
      (p) => `
      <div class="fn-lobby-player ${p.id === selfId ? 'self' : ''}">
        <div class="fn-lobby-player-avatar">👤</div>
        <div class="fn-lobby-player-meta">
          <strong>${p.name}</strong>
          <span>${playerRoleLabel(p.isHost, p.ready)}</span>
        </div>
      </div>
    `
    )
    .join('');

  return `
    <section class="fn-lobby-screen fn-lobby-room-screen">
      <header class="fn-lobby-head fn-lobby-room-head">
        <h2>LOBBY ONLINE</h2>
        <p>${state.status}</p>
        <div class="fn-lobby-room-head-right">
          <div class="fn-lobby-code-box">
            <span>CODICE</span>
            <strong>${code}</strong>
            <button class="btn-ghost" data-action="online-copy-code" data-code="${code}">COPIA</button>
          </div>
          <button class="btn-ghost" data-action="online-leave">ESCI LOBBY</button>
        </div>
      </div>

      <div class="fn-lobby-room-grid">
        <div class="fn-lobby-room-left">
          <h3>SCEGLI MODALITA</h3>
          <div class="fn-online-mode-quick" role="group" aria-label="Selezione modalita online lobby">
            ${['uno', 'ruba', 'scala40', 'blackjack', 'poker', 'burraco']
              .map((mode) => `<button class="fn-online-mode-btn ${room.gameId === mode ? 'active' : ''}" data-action="online-set-game" data-game="${mode}">${mode.toUpperCase()}</button>`)
              .join('')}
          </div>
          <div class="fn-lobby-room-meta">
            <span>Modalita: <strong>${room.gameId.toUpperCase()}</strong></span>
            <span>Giocatori: <strong>${room.players.length}/${room.maxPlayers}</strong></span>
          </div>

          <div class="fn-lobby-actions fn-lobby-actions-left">
            ${
              selfIsHost
                ? '<button class="btn-primary" data-action="online-start">GIOCA</button>'
                : '<button class="btn-ghost" data-action="online-ready">SONO PRONTO</button>'
            }
          </div>
        </div>

        <div class="fn-lobby-room-right">
          <h3>GIOCATORI IN LOBBY</h3>
          <div class="fn-lobby-players">${players}</div>
        </div>
      </div>
    </section>
  `;
}
