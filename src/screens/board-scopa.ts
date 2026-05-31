import { renderPlayerBadge, renderCardBack } from './player-badge';

export interface ScopaCard {
  suit: 'denari' | 'coppe' | 'bastoni' | 'spade';
  value: number;
  selected?: boolean;
}

export interface ScopaViewState {
  playerHand: ScopaCard[];
  tableCards: ScopaCard[];
  deckCount: number;
  playerScore: number;
  playerCaptures: number;
  scopeCount: number;
  isPlayerTurn: boolean;
  opponents: { name: string; cardCount: number; isActive: boolean; position: 'top'; title?: string; score: number; captures: number }[];
  selectedHandCard: number | null;
  selectedTableCards: number[];
}

const SUIT_EMOJI: Record<ScopaCard['suit'], string> = {
  denari: '🪙',
  coppe: '🏆',
  bastoni: '🌿',
  spade: '⚔️'
};

export function renderScopaBoard(state: ScopaViewState): string {
  const opp = state.opponents[0];
  return `
    <div class="fn-board fn-board-scopa">
      <div class="fn-board-center">
        ${
          opp
            ? `<div class="fn-opponents-row">${renderPlayerBadge({ ...opp, position: 'top' })}${renderCardBack(opp.cardCount)}<div class="fn-score-chip">🏅 ${opp.score}pt · 🃏 ${opp.captures} · scope ${opp.captures}</div></div>`
            : ''
        }

        <div class="fn-table-area scopa-table">
          <button class="fn-deck-btn ${!state.isPlayerTurn ? 'disabled' : ''}" data-action="draw-card">
            <span class="fn-deck-count">${state.deckCount}</span>
            <span class="fn-deck-label">MAZZO</span>
          </button>
          <div class="fn-scopa-table-cards">
            ${
              state.tableCards.length === 0
                ? '<span class="fn-table-empty">Tavolo vuoto</span>'
                : state.tableCards
                    .map(
                      (c, i) => `
                  <div class="fn-card fn-scopa-card suit-${c.suit} ${state.selectedTableCards.includes(i) ? 'selected' : ''}" data-action="select-table-card" data-idx="${i}" aria-label="${c.value} ${SUIT_EMOJI[c.suit]}">
                    <span class="fn-card-suit">${SUIT_EMOJI[c.suit]}</span>
                    <span class="fn-card-val">${c.value}</span>
                  </div>
                `
                    )
                    .join('')
            }
          </div>
          ${
            state.selectedHandCard !== null && state.selectedTableCards.length > 0
              ? '<button class="fn-scopa-capture btn-primary" data-action="scopa-capture">PRENDI</button>'
              : ''
          }
        </div>

        <div class="fn-player-area">
          <div class="fn-player-stats">
            <span>🏅 ${state.playerScore}pt</span>
            <span>🃏 ${state.playerCaptures} prese</span>
            <span>🧹 ${state.scopeCount} scope</span>
          </div>
          <div class="fn-hand" role="list">
            ${state.playerHand
              .map(
                (card, i) => `
              <button class="fn-card fn-scopa-card suit-${card.suit} ${state.selectedHandCard === i ? 'selected' : ''}" data-action="select-hand-card" data-index="${i}" role="listitem" aria-label="${card.value} ${SUIT_EMOJI[card.suit]}">
                <span class="fn-card-suit">${SUIT_EMOJI[card.suit]}</span>
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
