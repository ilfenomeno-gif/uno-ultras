import { renderPlayerBadge } from './player-badge';

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

export function renderRubaBoard(state: RubaViewState): string {
  const opponentTop = state.opponents.find((o) => o.position === 'top');
  const opponentLeft = state.opponents.find((o) => o.position === 'left');
  const opponentRight = state.opponents.find((o) => o.position === 'right');

  return `
    <div class="fn-board fn-board-ruba">
      ${opponentLeft ? `<div class="fn-side left">${renderPlayerBadge(opponentLeft)}</div>` : ''}
      ${opponentRight ? `<div class="fn-side right">${renderPlayerBadge(opponentRight)}</div>` : ''}

      <div class="fn-board-center">
        ${opponentTop ? `<div class="fn-opponents-row">${renderPlayerBadge(opponentTop)}</div>` : ''}

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
                      <span class="fn-card-val">${c.value}</span>
                    </div>
                  `
                    )
                    .join('')
            }
          </div>
        </div>

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
