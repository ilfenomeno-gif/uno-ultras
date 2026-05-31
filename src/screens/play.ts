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
let pendingWildIndex: number | null = null;

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

function pushGameplayMessage(message: string): void {
  const penaltyToken = '(penalita UNO +2)';
  if (message.includes(penaltyToken)) {
    gameLog.unshift(message.replace(` ${penaltyToken}`, '').replace(penaltyToken, '').trim());
    gameLog.unshift('Penalita: non hai dichiarato UNO! +2 carte.');
    return;
  }
  gameLog.unshift(message);
}

function focusAfterAction(): void {
  window.requestAnimationFrame(() => {
    const logEntry = document.querySelector('.log .log-entry') as HTMLElement | null;
    const playableCard = document.querySelector('.hand .card.playable:not([disabled])') as HTMLElement | null;
    (logEntry ?? playableCard)?.focus();
  });
}

export function getPendingWildIndex(): number | null {
  return pendingWildIndex;
}

export function clearPendingWild(): void {
  pendingWildIndex = null;
}

export function setPendingWild(index: number): void {
  pendingWildIndex = index;
}

export function setSelectedGame(game: GameId): void {
  selectedGame = game;
}

export function setSelectedPlayers(players: PlayersMode): void {
  selectedPlayers = players;
}

export function renderGameMatrix(): string {
  const games = [`<button class="chip active" data-action="pick-game" data-game="uno" aria-pressed="true">${GAME_LABELS.uno}</button>`];

  return `
    <section class="panel">
      <h2>Modalita disponibile</h2>
      <p>In questa build e disponibile solo UNO in formato 1v1.</p>
      <div class="chip-wrap">${games.join('')}</div>
      <div class="launch-row">
        <span>${GAME_LABELS.uno} - 1v1</span>
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
  const myTurn = state.currentPlayerIndex === 0;
  const hand = me.hand
    .map((card, idx) => {
      const playable = myTurn && playableIndices.includes(idx);
      return `
        <button class="card ${colorClass(card.color)} ${playable ? 'playable' : ''}" data-action="play-card" data-index="${idx}" aria-label="${cardAriaLabel(card, playable)}" ${playable ? '' : 'disabled'}>
          <span>${cardLabel(card)}</span>
        </button>
      `;
    })
    .join('');

  const colorPicker =
    pendingWildIndex !== null
      ? `
      <div class="color-picker" role="dialog" aria-modal="true" aria-label="Scegli il colore per il Jolly">
        <p>Scegli il colore:</p>
        <div class="color-picker-buttons">
          <button class="card red" data-action="choose-color" data-color="red" aria-label="Rosso" type="button">Rosso</button>
          <button class="card blue" data-action="choose-color" data-color="blue" aria-label="Blu" type="button">Blu</button>
          <button class="card green" data-action="choose-color" data-color="green" aria-label="Verde" type="button">Verde</button>
          <button class="card yellow" data-action="choose-color" data-color="yellow" aria-label="Giallo" type="button">Giallo</button>
        </div>
      </div>
    `
      : '';

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
        <button class="deck" data-action="draw" aria-label="Pesca carta dal mazzo" type="button" ${myTurn ? '' : 'disabled'}>PESCA</button>
        <div class="discard ${colorClass(topCard.color)}" aria-label="Carta scartata: ${cardLabel(topCard)} ${colorLabel(topCard.color)}">${cardLabel(topCard)}</div>
      </div>
      ${colorPicker}
      <div class="hand">${hand}</div>
      <div class="game-actions">
        <button class="btn-ghost" data-action="say-uno" ${myTurn ? '' : 'disabled'}>Dichiara UNO</button>
        <button class="btn-ghost" data-action="draw" ${myTurn ? '' : 'disabled'}>Pesca Carta</button>
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
  `;
}

export function stopGame(): void {
  engine = null;
  gameLog = [];
  clearPendingWild();
  clearAiTimer();
  renderCallback?.();
}

export function startMode(): void {
  selectedGame = 'uno';
  selectedPlayers = 2;

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
  if (action === 'pick-game' && actor.dataset.game === 'uno') {
    selectedGame = 'uno';
    renderCallback?.();
    return true;
  }

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
    pushGameplayMessage(message);
    renderCallback?.();
    focusAfterAction();
    triggerAi();
    return true;
  }

  if (action === 'say-uno' && engine && engine.state.currentPlayerIndex === 0) {
    engine.sayUno();
    if (engine.getCurrentPlayer().hand.length === 1) {
      gameLog.unshift('UNO dichiarato! Ora gioca la tua ultima carta.');
    } else {
      gameLog.unshift('UNO dichiarato.');
    }
    renderCallback?.();
    focusAfterAction();
    return true;
  }

  if (action === 'play-card' && engine && engine.state.currentPlayerIndex === 0) {
    const index = Number(actor.dataset.index ?? '-1');
    const card = engine.state.players[0]?.hand[index];
    if (card && (card.value === 'wild' || card.value === 'wild4')) {
      setPendingWild(index);
      renderCallback?.();
      window.requestAnimationFrame(() => {
        const picker = document.querySelector('.color-picker button') as HTMLElement | null;
        picker?.focus();
      });
      return true;
    }

    const message = engine.playFromCurrent(index);
    pushGameplayMessage(message);

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

  if (action === 'choose-color' && engine && pendingWildIndex !== null) {
    const color = actor.dataset.color as Exclude<CardColor, 'wild'> | undefined;
    if (!color) return true;

    const index = pendingWildIndex;
    clearPendingWild();
    const message = engine.playFromCurrent(index, color);
    pushGameplayMessage(message);

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
