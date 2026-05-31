import { notify } from '../core/notify';
import { GAME_LABELS, registerWin } from '../core/store';
import { runAiIfNeeded, clearAiTimer } from '../game/ai';
import { UnoEngine, type Card, type CardColor } from '../game/uno';
import type { GameId, PlayersMode } from '../game/types';

let selectedGame: GameId = 'uno';
let selectedPlayers: PlayersMode = 2;
let engine: UnoEngine | null = null;
let gameLog: string[] = [];
let renderCallback: (() => void) | null = null;

export function setPlayRenderCallback(callback: () => void): void {
  renderCallback = callback;
}

function colorClass(color: CardColor): string {
  if (color === 'wild') return 'wild';
  return color;
}

function cardLabel(card: Card): string {
  if (card.value === 'wild') return 'Jolly';
  if (card.value === 'wild4') return 'Jolly +4';
  if (card.value === 'draw2') return '+2';
  if (card.value === 'reverse') return 'Reverse';
  if (card.value === 'skip') return 'Salta';
  return card.value;
}

function colorLabel(color: CardColor): string {
  if (color === 'red') return 'rosso';
  if (color === 'blue') return 'blu';
  if (color === 'green') return 'verde';
  if (color === 'yellow') return 'giallo';
  return 'jolly';
}

function cardAriaLabel(card: Card, playable: boolean): string {
  return `Carta ${cardLabel(card)} ${colorLabel(card.color)}, ${playable ? 'giocabile' : 'non giocabile'}`;
}

function focusAfterAction(): void {
  window.requestAnimationFrame(() => {
    const logEntry = document.querySelector('.log .log-entry') as HTMLElement | null;
    const playableCard = document.querySelector('.hand .card.playable:not([disabled])') as HTMLElement | null;
    (logEntry ?? playableCard)?.focus();
  });
}

export function setSelectedGame(game: GameId): void {
  selectedGame = game;
}

export function setSelectedPlayers(players: PlayersMode): void {
  selectedPlayers = players;
}

export function renderGameMatrix(): string {
  const games = Object.entries(GAME_LABELS).map(([id, name]) => {
    const active = selectedGame === id;
    return `<button class="chip ${active ? 'active' : ''}" data-action="pick-game" data-game="${id}" aria-pressed="${active ? 'true' : 'false'}">${name}</button>`;
  });

  const modes = [2, 3, 4].map((value) => {
    const active = selectedPlayers === value;
    const label = value === 2 ? '1v1' : `${value} giocatori`;
    return `<button class="chip ${active ? 'active' : ''}" data-action="pick-players" data-players="${value}" aria-pressed="${active ? 'true' : 'false'}">${label}</button>`;
  });

  return `
    <section class="panel">
      <h2>Modalita complete</h2>
      <p>Scegli gioco e numero giocatori. UNO e gia giocabile in demo beta.</p>
      <div class="chip-wrap">${games.join('')}</div>
      <div class="chip-wrap">${modes.join('')}</div>
      <div class="launch-row">
        <span>${GAME_LABELS[selectedGame]} - ${selectedPlayers === 2 ? '1v1' : `${selectedPlayers} giocatori`}</span>
        <button class="btn-primary" data-action="start-mode">Avvia Modalita</button>
      </div>
    </section>
  `;
}

export function renderUnoBoard(): string {
  if (!engine) return '';

  const state = engine.state;
  const topCard = state.discard[state.discard.length - 1];
  const me = state.players[0];

  const opponents = state.players
    .slice(1)
    .map((p, i) => `<div class="opponent ${state.currentPlayerIndex === i + 1 ? 'active' : ''}">${p.name}: ${p.hand.length} carte</div>`)
    .join('');

  const playableIndices = engine.getPlayableIndicesForCurrent();
  const hand = me.hand
    .map((card, idx) => {
      const playable = state.currentPlayerIndex === 0 && playableIndices.includes(idx);
      return `
        <button class="card ${colorClass(card.color)} ${playable ? 'playable' : ''}" data-action="play-card" data-index="${idx}" aria-label="${cardAriaLabel(card, playable)}" ${playable ? '' : 'disabled'}>
          <span>${cardLabel(card)}</span>
        </button>
      `;
    })
    .join('');

  return `
    <section class="panel game">
      <div class="game-top">
        <div>
          <h2>Partita UNO Demo</h2>
          <p>Turno: ${state.players[state.currentPlayerIndex]?.name ?? '?'} • Colore attivo: ${state.activeColor}</p>
        </div>
        <div class="pill">Draw Stack: ${state.drawStack}</div>
      </div>
      <div class="opponents">${opponents}</div>
      <div class="table-area">
        <div class="deck" data-action="draw" aria-label="Pesca carta dal mazzo">PESCA</div>
        <div class="discard ${colorClass(topCard.color)}" aria-label="Carta scartata: ${cardLabel(topCard)} ${colorLabel(topCard.color)}">${cardLabel(topCard)}</div>
      </div>
      <div class="hand">${hand}</div>
      <div class="game-actions">
        <button class="btn-ghost" data-action="say-uno">Dichiara UNO</button>
        <button class="btn-ghost" data-action="draw">Pesca Carta</button>
        <button class="btn-ghost" data-action="stop-game">Abbandona Match</button>
      </div>
      <div class="log" aria-live="polite" aria-atomic="false">${gameLog.slice(0, 6).map((x) => `<button type="button" class="log-entry">${x}</button>`).join('')}</div>
    </section>
  `;
}

export function renderPlay(): string {
  return `
    ${renderGameMatrix()}
    ${engine ? renderUnoBoard() : ''}
    <section class="panel">
      <h3>Meccaniche reference dal monolite</h3>
      <p>Il file padre rimane intatto. Questa beta e una ricostruzione da zero pronta a integrare progressivamente tutte le meccaniche.</p>
      <a class="inline-link" href="/legacy/uno_ultra_v52_reference.html" target="_blank" rel="noopener noreferrer">Apri riferimento monolite</a>
    </section>
  `;
}

export function stopGame(): void {
  engine = null;
  gameLog = [];
  clearAiTimer();
  renderCallback?.();
}

export function startMode(): void {
  if (selectedGame !== 'uno') {
    notify(`${GAME_LABELS[selectedGame]} pronta come modulo beta UI. Gameplay completo in prossima fase.`);
    return;
  }

  engine = new UnoEngine(selectedPlayers);
  gameLog = [`Partita UNO avviata (${selectedPlayers === 2 ? '1v1' : `${selectedPlayers} giocatori`}).`];
  renderCallback?.();
  triggerAi();
}

function triggerAi(): void {
  if (!engine) return;
  runAiIfNeeded({
    engine,
    onMessage: (message) => {
      gameLog.unshift(message);
    },
    onWin: (winner) => {
      const won = winner === 'Tu';
      registerWin(won);
      notify(won ? 'Hai vinto!' : `${winner} vince!`);
      stopGame();
    },
    onRender: () => {
      renderCallback?.();
    }
  });
}

export function handlePlayAction(action: string, actor: HTMLElement): boolean {
  if (action === 'start-mode') {
    startMode();
    return true;
  }

  if (action === 'stop-game') {
    stopGame();
    return true;
  }

  if (action === 'draw' && engine && engine.state.currentPlayerIndex === 0) {
    const message = engine.drawForCurrent();
    gameLog.unshift(message);
    renderCallback?.();
    focusAfterAction();
    triggerAi();
    return true;
  }

  if (action === 'say-uno' && engine && engine.state.currentPlayerIndex === 0) {
    engine.sayUno();
    gameLog.unshift('UNO dichiarato.');
    renderCallback?.();
    focusAfterAction();
    return true;
  }

  if (action === 'play-card' && engine && engine.state.currentPlayerIndex === 0) {
    const index = Number(actor.dataset.index ?? '-1');
    const message = engine.playFromCurrent(index);
    gameLog.unshift(message);

    if (engine.state.winner) {
      const won = engine.state.winner === 'Tu';
      registerWin(won);
      notify(won ? 'Hai vinto!' : `${engine.state.winner} vince!`);
      stopGame();
      return true;
    }

    renderCallback?.();
    focusAfterAction();
    triggerAi();
    return true;
  }

  return false;
}
