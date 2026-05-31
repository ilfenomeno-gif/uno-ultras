import { renderPlayerBadge, renderCardBack } from './player-badge';

export interface UnoViewState {
  playerHand: { color: string; value: string; playable: boolean }[];
  discardTop: { color: string; value: string } | null;
  deckCount: number;
  opponents: { name: string; cardCount: number; isActive: boolean; position: 'top' | 'left' | 'right'; title?: string }[];
  currentPlayerIndex: number;
  isPlayerTurn: boolean;
  canDraw: boolean;
  unoAlert: boolean;
}

export function renderUnoBoard(state: UnoViewState): string {
  const opponentTop = state.opponents.find((o) => o.position === 'top');
  const opponentLeft = state.opponents.find((o) => o.position === 'left');
  const opponentRight = state.opponents.find((o) => o.position === 'right');

  return `
    <div class="fn-board fn-board-uno">
      ${opponentLeft ? `<div class="fn-side left">${renderPlayerBadge(opponentLeft)}${renderCardBack(opponentLeft.cardCount, true)}</div>` : ''}
      ${opponentRight ? `<div class="fn-side right">${renderPlayerBadge(opponentRight)}${renderCardBack(opponentRight.cardCount, true)}</div>` : ''}

      <div class="fn-board-center">
        ${opponentTop ? `<div class="fn-opponents-row">${renderPlayerBadge(opponentTop)}${renderCardBack(opponentTop.cardCount)}</div>` : ''}

        <div class="fn-table-area">
          <button class="fn-deck-btn ${!state.canDraw ? 'disabled' : ''}" data-action="draw-card" ${!state.canDraw ? 'disabled' : ''} aria-label="Pesca una carta">
            <span class="fn-deck-count">${state.deckCount}</span>
            <span class="fn-deck-label">PESCA</span>
          </button>

          ${
            state.discardTop
              ? `<div class="fn-discard fn-card color-${state.discardTop.color}"><span class="fn-card-val">${state.discardTop.value}</span></div>`
              : '<div class="fn-discard empty"></div>'
          }
        </div>

        <div class="fn-player-area">
          <div class="fn-player-self-badge">
            <div class="fn-badge-avatar" id="fn-self-av"></div>
            <span id="fn-self-name"></span>
          </div>

          <div class="fn-hand-toolbar">
            <button class="fn-hand-sort btn-ghost" data-action="sort-hand" aria-label="Riordina per colore">🎨 RIORDINA</button>
            ${
              state.unoAlert
                ? '<button class="fn-uno-btn" data-action="declare-uno" aria-label="Dichiara UNO!">🔴 UNO!</button>'
                : ''
            }
          </div>

          <div class="fn-hand" role="list" aria-label="Le tue carte">
            ${state.playerHand
              .map(
                (card, i) => `
              <button class="fn-card fn-hand-card color-${card.color} ${card.playable ? 'playable' : 'dimmed'}"
                data-action="${card.playable ? 'play-card' : ''}"
                data-index="${i}"
                ${!card.playable ? 'disabled' : ''}
                role="listitem"
                aria-label="Carta ${card.value} ${card.color}${card.playable ? ', giocabile' : ', non giocabile'}">
                <span class="fn-card-val">${card.value}</span>
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
