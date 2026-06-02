import { renderPlayerBadge, renderCardBack } from './player-badge';
import { renderGameShell } from './game-shell';
import { formatUnoFace, getUnoCardAriaLabel } from './card-face';

export interface UnoViewState {
  playerHand: { color: string; value: string; playable: boolean }[];
  discardTop: { color: string; value: string } | null;
  deckCount: number;
  opponents: { name: string; cardCount: number; isActive: boolean; position: 'top' | 'left' | 'right'; title?: string }[];
  currentPlayerIndex: number;
  isPlayerTurn: boolean;
  canDraw: boolean;
  unoAlert: boolean;
  log: string[];
}

export function renderUnoBoard(state: UnoViewState): string {
  const opponentTop = state.opponents.find((o) => o.position === 'top');
  const opponentLeft = state.opponents.find((o) => o.position === 'left');
  const opponentRight = state.opponents.find((o) => o.position === 'right');

  const centerContent = `
    <div class="fn-uno-table-stage">
      <div class="fn-table-area fn-table-area-uno">
        <button class="fn-deck-btn ${!state.canDraw ? 'disabled' : ''}" data-action="draw-card" ${!state.canDraw ? 'disabled' : ''} aria-label="Pesca una carta">
          <span class="fn-deck-count">${state.deckCount}</span>
          <span class="fn-deck-label">PESCA</span>
        </button>
        <div class="fn-table-turn-indicator ${state.isPlayerTurn ? 'active' : ''}"></div>
        ${
          state.discardTop
            ? `<div class="fn-discard fn-card color-${state.discardTop.color}"><span class="fn-card-val">${formatUnoFace(state.discardTop.value)}</span></div>`
            : '<div class="fn-discard empty"></div>'
        }
      </div>
    </div>
  `;

  const bottomContent = `
    <div class="fn-player-dock-main">
      <div class="fn-player-dock-top">
        <div class="fn-player-self-badge fn-player-self-badge-uno">
          <div class="fn-self-chip">TU</div>
          <div class="fn-player-dock-meta">
            <span class="fn-player-dock-rank">SR · Bronze</span>
            <span class="fn-player-dock-count">${state.playerHand.length} carte</span>
          </div>
        </div>
        <div class="fn-hand-toolbar fn-hand-toolbar-uno">
          <button class="fn-hand-sort btn-ghost" data-action="sort-hand" aria-label="Riordina per colore">Ordina</button>
          ${state.unoAlert ? '<button class="fn-uno-btn" data-action="declare-uno" aria-label="Dichiara UNO!">UNO!</button>' : ''}
        </div>
      </div>

      <div class="fn-hand fn-hand-uno" role="list" aria-label="Le tue carte">
        ${state.playerHand
          .map(
            (card, i) => `
          <button class="fn-card fn-hand-card color-${card.color} ${card.playable ? 'playable' : 'dimmed'}"
            data-action="${card.playable ? 'play-card' : ''}"
            data-index="${i}"
            ${!card.playable ? 'disabled' : ''}
            role="listitem"
            aria-label="${getUnoCardAriaLabel(card.value, card.color, card.playable)}">
            <span class="fn-card-val">${formatUnoFace(card.value)}</span>
          </button>
        `
          )
          .join('')}
      </div>
    </div>
  `;

  const bottomSideContent = `
    <aside class="fn-board-log fn-board-log-uno" aria-label="Log partita">
      <h3>Log Partita</h3>
      <div class="fn-board-log-list">
        ${state.log.slice(0, 6).map((entry) => `<div class="fn-board-log-entry">${entry}</div>`).join('')}
      </div>
    </aside>
  `;

  return renderGameShell({
    boardClass: 'fn-board-uno',
    title: 'UNO',
    subtitle: state.isPlayerTurn ? 'Il tuo turno' : 'Turno avversario',
    topSlot: opponentTop ? `<div class="fn-opponents-row fn-opponents-row-uno">${renderPlayerBadge(opponentTop)}${renderCardBack(opponentTop.cardCount)}</div>` : '',
    leftSlot: opponentLeft ? `${renderPlayerBadge(opponentLeft)}${renderCardBack(opponentLeft.cardCount, true)}` : '',
    rightSlot: opponentRight ? `${renderPlayerBadge(opponentRight)}${renderCardBack(opponentRight.cardCount, true)}` : '',
    centerContent,
    bottomContent,
    bottomSideContent
  });
}
