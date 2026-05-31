import { renderPlayerBadge, renderCardBack } from './player-badge';

export interface BurracoCard {
  color: string;
  value: string;
  selected?: boolean;
}

export interface Meld {
  id: string;
  cards: BurracoCard[];
  isBurraco: boolean;
}

export interface BurracoViewState {
  playerHand: BurracoCard[];
  melds: Meld[];
  pozzetto: BurracoCard[];
  pozzettoPreso: boolean;
  deckCount: number;
  discardTop: BurracoCard | null;
  isPlayerTurn: boolean;
  playerScore: number;
  opponents: {
    name: string;
    cardCount: number;
    isActive: boolean;
    position: 'top' | 'left' | 'right';
    title?: string;
    score: number;
    melds: Meld[];
  }[];
}

export function renderBurracoBoard(state: BurracoViewState): string {
  const opponentTop = state.opponents.find((o) => o.position === 'top');
  const opponentLeft = state.opponents.find((o) => o.position === 'left');
  const opponentRight = state.opponents.find((o) => o.position === 'right');

  return `
    <div class="fn-board fn-board-burraco">
      ${opponentLeft ? `<div class="fn-side left">${renderPlayerBadge(opponentLeft)}</div>` : ''}
      ${opponentRight ? `<div class="fn-side right">${renderPlayerBadge(opponentRight)}</div>` : ''}

      <div class="fn-board-center">
        ${
          opponentTop
            ? `<div class="fn-opponents-row">${renderPlayerBadge(opponentTop)}${renderCardBack(opponentTop.cardCount)}<div class="fn-meld-preview">${opponentTop.melds
                .map((m) => `<div class="fn-meld-chip ${m.isBurraco ? 'burraco' : ''}">${m.cards.length}🃏${m.isBurraco ? ' B' : ''}</div>`)
                .join('')}</div></div>`
            : ''
        }

        <div class="fn-table-area">
          <button class="fn-deck-btn ${!state.isPlayerTurn ? 'disabled' : ''}" data-action="draw-card">
            <span class="fn-deck-count">${state.deckCount}</span>
            <span class="fn-deck-label">PESCA</span>
          </button>
          ${
            state.discardTop
              ? `<div class="fn-discard fn-card color-${state.discardTop.color}" data-action="take-discard"><span class="fn-card-val">${state.discardTop.value}</span></div>`
              : '<div class="fn-discard empty"></div>'
          }

          <div class="fn-pozzetto ${state.pozzettoPreso ? 'taken' : ''}" data-action="${
    !state.pozzettoPreso ? 'take-pozzetto' : ''
  }" title="${state.pozzettoPreso ? 'Pozzetto gia preso' : 'Prendi pozzetto'}">
            <span>${state.pozzettoPreso ? '✓' : '📦'}</span>
            <small>POZZETTO</small>
          </div>
        </div>

        <div class="fn-melds-area">
          ${state.melds
            .map(
              (m) => `
            <div class="fn-meld ${m.isBurraco ? 'burraco' : ''}" data-meld-id="${m.id}">
              ${m.cards.map((c) => `<div class="fn-card fn-mini-meld-card color-${c.color}"><span>${c.value}</span></div>`).join('')}
              ${m.isBurraco ? '<span class="fn-burraco-badge">BURRACO</span>' : ''}
            </div>
          `
            )
            .join('')}
          <button class="fn-meld-new btn-ghost" data-action="new-meld">+ COMBINAZIONE</button>
        </div>

        <div class="fn-player-area">
          <div class="fn-hand-toolbar">
            <button class="btn-ghost" data-action="sort-hand">🎨 RIORDINA</button>
            <span class="fn-score-chip">🏅 ${state.playerScore}pt</span>
          </div>
          <div class="fn-hand" role="list">
            ${state.playerHand
              .map(
                (card, i) => `
              <button class="fn-card fn-hand-card color-${card.color} ${card.selected ? 'selected' : ''}" data-action="select-card" data-index="${i}" role="listitem" aria-label="${card.value} ${card.color}">
                <span class="fn-card-val">${card.value}</span>
              </button>
            `
              )
              .join('')}
          </div>
          ${
            state.isPlayerTurn
              ? '<div class="fn-burraco-actions"><button class="btn-ghost" data-action="discard-card">SCARTA</button><button class="btn-ghost" data-action="add-to-meld">+ A COMBIN.</button></div>'
              : ''
          }
        </div>
      </div>
    </div>
  `;
}
