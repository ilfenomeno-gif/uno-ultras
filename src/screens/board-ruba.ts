import { renderPlayerBadge } from './player-badge';
import { renderGameShell } from './game-shell';
import { formatClassicFace } from './card-face';

export interface RubaCard {
  color: string;
  value: string;
  playable: boolean;
}

export interface RubaViewState {
  playerHand: RubaCard[];
  tableCards: RubaCard[];
  deckCount: number;
  isPlayerTurn: boolean;
  opponents: { name: string; cardCount: number; isActive: boolean; position: 'top' | 'left' | 'right'; title?: string }[];
}

export interface RubaBoardOptions {
  title?: string;
  boardClass?: string;
}

export function renderRubaBoard(state: RubaViewState, options: RubaBoardOptions = {}): string {
  const opponentTop = state.opponents.find((o) => o.position === 'top');
  const opponentLeft = state.opponents.find((o) => o.position === 'left');
  const opponentRight = state.opponents.find((o) => o.position === 'right');

  const centerContent = `
    <div class="fn-table-area ruba-table">
      <button class="fn-deck-btn ${!state.isPlayerTurn ? 'disabled' : ''}" data-action="draw-card" aria-label="Pesca">
        <span class="fn-deck-count">${state.deckCount}</span>
        <span class="fn-deck-label">PESCA</span>
      </button>

      <div class="fn-ruba-table-cards">
        ${
          state.tableCards.length === 0
            ? '<span class="fn-table-empty">Tavolo vuoto</span>'
            : state.tableCards
                .map(
                  (c, i) => `
                <div class="fn-card color-${c.color}" data-action="capture-stack" data-idx="${i}" aria-label="Cattura ${c.value}">
                  <span class="fn-card-val">${formatClassicFace(c.value)}</span>
                </div>
              `
                )
                .join('')
        }
      </div>
    </div>
  `;

  const bottomContent = `
    <div class="fn-player-area">
      <div class="fn-hand-toolbar">
        <span class="fn-hand-count">Le tue carte: ${state.playerHand.length}</span>
      </div>
      <div class="fn-hand" role="list">
        ${state.playerHand
          .map(
            (card, i) => `
          <button class="fn-card fn-hand-card color-${card.color} ${card.playable ? 'playable' : 'dimmed'}"
            data-action="${card.playable ? 'play-ruba-card' : ''}"
            data-index="${i}"
            ${!card.playable ? 'disabled' : ''}
            role="listitem"
            aria-label="${card.value} ${card.color}">
            <span class="fn-card-val">${formatClassicFace(card.value)}</span>
          </button>
        `
          )
          .join('')}
      </div>
    </div>
  `;

  return renderGameShell({
    boardClass: options.boardClass ?? 'fn-board-ruba',
    title: options.title ?? 'RUBA MAZZETTO',
    subtitle: state.isPlayerTurn ? 'Il tuo turno' : 'Turno avversario',
    topSlot: opponentTop ? `<div class="fn-opponents-row">${renderPlayerBadge(opponentTop)}</div>` : '',
    leftSlot: opponentLeft ? renderPlayerBadge(opponentLeft) : '',
    rightSlot: opponentRight ? renderPlayerBadge(opponentRight) : '',
    centerContent,
    bottomContent
  });
}
