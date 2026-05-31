import { renderPlayerBadge, renderCardBack } from './player-badge';

export interface Scala40Card {
  color: string;
  value: string;
  selected: boolean;
}

export interface Playlist {
  id: string;
  cards: Scala40Card[];
  label: string;
}

export interface Scala40ViewState {
  playerHand: Scala40Card[];
  playlists: Playlist[];
  activePlaylistId: string | null;
  discardTop: Scala40Card | null;
  deckCount: number;
  playerScore: number;
  opponents: { name: string; cardCount: number; isActive: boolean; position: 'top' | 'left' | 'right'; title?: string; score: number }[];
  canOpen: boolean;
  isPlayerTurn: boolean;
}

export function renderScala40Board(state: Scala40ViewState): string {
  const opponentTop = state.opponents.find((o) => o.position === 'top');
  const opponentLeft = state.opponents.find((o) => o.position === 'left');
  const opponentRight = state.opponents.find((o) => o.position === 'right');

  return `
    <div class="fn-board fn-board-scala40">
      ${opponentLeft ? `<div class="fn-side left">${renderPlayerBadge(opponentLeft)}</div>` : ''}
      ${opponentRight ? `<div class="fn-side right">${renderPlayerBadge(opponentRight)}</div>` : ''}

      <div class="fn-board-center">
        ${
          opponentTop
            ? `<div class="fn-opponents-row">${renderPlayerBadge(opponentTop)}${renderCardBack(opponentTop.cardCount)}</div>`
            : ''
        }

        <div class="fn-table-area">
          <button class="fn-deck-btn ${!state.isPlayerTurn ? 'disabled' : ''}" data-action="draw-card" aria-label="Pesca">
            <span class="fn-deck-count">${state.deckCount}</span>
            <span class="fn-deck-label">PESCA</span>
          </button>
          ${
            state.discardTop
              ? `<div class="fn-discard fn-card color-${state.discardTop.color}" data-action="take-discard"><span class="fn-card-val">${state.discardTop.value}</span></div>`
              : '<div class="fn-discard empty"></div>'
          }
        </div>

        <div class="fn-scala-bottom">
          <div class="fn-playlist-panel">
            <div class="fn-playlist-header">
              <span class="fn-playlist-label">PLAYLIST</span>
              <button class="fn-playlist-add btn-ghost" data-action="new-playlist" aria-label="Nuova playlist">+</button>
            </div>
            <div class="fn-playlist-list">
              ${state.playlists
                .map(
                  (pl) => `
                <div class="fn-playlist-item ${state.activePlaylistId === pl.id ? 'active' : ''}" data-action="select-playlist" data-playlist-id="${pl.id}">
                  <span class="fn-playlist-name">${pl.label}</span>
                  <div class="fn-playlist-cards-mini">
                    ${pl.cards
                      .slice(0, 4)
                      .map((c) => `<span class="fn-mini-card color-${c.color}">${c.value}</span>`)
                      .join('')}
                    ${pl.cards.length > 4 ? `<span class="fn-mini-more">+${pl.cards.length - 4}</span>` : ''}
                  </div>
                </div>
              `
                )
                .join('')}
            </div>

            <button class="fn-scala-apri ${!state.canOpen ? 'disabled' : ''}" data-action="open-scala" ${
    !state.canOpen ? 'disabled' : ''
  } aria-label="Apri playlist (richiede 40 punti)">
              ${state.canOpen ? '✅ APRI' : `🔒 APRI (${state.playerScore}/40)`}
            </button>
          </div>

          <div class="fn-player-area flex-1">
            <div class="fn-hand-toolbar">
              <button class="btn-ghost" data-action="sort-hand">🎨 RIORDINA</button>
              ${state.activePlaylistId ? '<button class="btn-ghost" data-action="add-to-playlist">+ PLAYLIST</button>' : ''}
            </div>
            <div class="fn-hand" role="list">
              ${state.playerHand
                .map(
                  (card, i) => `
                <button class="fn-card fn-hand-card color-${card.color} ${card.selected ? 'selected' : ''}" data-action="select-card" data-index="${i}" role="listitem" aria-label="${card.value} ${card.color}${card.selected ? ', selezionata' : ''}">
                  <span class="fn-card-val">${card.value}</span>
                </button>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
