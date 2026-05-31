import './styles/main.scss';
import { UnoEngine, type Card, type CardColor } from './game/uno';

type ScreenId = 'home' | 'play' | 'shop' | 'settings' | 'profile' | 'leaderboard';
type PlayersMode = 2 | 3 | 4;
type GameId = 'uno' | 'ruba' | 'scopa' | 'poker' | 'burraco' | 'blackjack' | 'millemiglia' | 'scala40';

type DemoProfile = {
  name: string;
  wins: number;
  losses: number;
  games: number;
  mmr: number;
  credits: number;
  titles: string[];
};

const PROFILE_KEY = 'uno-ultras-definitivo-profile';

const GAME_LABELS: Record<GameId, string> = {
  uno: 'UNO',
  ruba: 'Ruba Mazzetto',
  scopa: 'Scopa',
  poker: 'Poker',
  burraco: 'Burraco',
  blackjack: 'Blackjack',
  millemiglia: 'Millemiglia',
  scala40: 'Scala 40'
};

const RANKS = [
  'Bronzo I',
  'Bronzo II',
  'Bronzo III',
  'Argento I',
  'Argento II',
  'Argento III',
  'Oro I',
  'Oro II',
  'Oro III',
  'Platino I',
  'Platino II',
  'Platino III',
  'Diamante I',
  'Diamante II',
  'Diamante III',
  'Campione I',
  'Campione II',
  'Campione III',
  'Grande Campione',
  'SSL'
];

const TITLES = [
  'Architetto del Caos',
  'Creatura del Vuoto',
  'Jolly del Mazzo',
  'Leggenda di UNO',
  'Maestro di Scala 40',
  'Re dei Ladri',
  'Dio del 21',
  'World Champion Supreme'
];

let currentScreen: ScreenId = resolveScreenFromPath(location.pathname);
let selectedGame: GameId = 'uno';
let selectedPlayers: PlayersMode = 2;
let engine: UnoEngine | null = null;
let gameLog: string[] = [];
let aiTimer: number | null = null;
let profile = loadProfile();

function loadProfile(): DemoProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) throw new Error('empty');
    const parsed = JSON.parse(raw) as DemoProfile;
    return {
      name: parsed.name || 'Giocatore',
      wins: parsed.wins || 0,
      losses: parsed.losses || 0,
      games: parsed.games || 0,
      mmr: parsed.mmr || 200,
      credits: parsed.credits || 1000,
      titles: Array.isArray(parsed.titles) ? parsed.titles : []
    };
  } catch {
    return {
      name: 'Giocatore',
      wins: 0,
      losses: 0,
      games: 0,
      mmr: 200,
      credits: 1000,
      titles: ['Architetto del Caos']
    };
  }
}

function saveProfile(): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function resolveScreenFromPath(pathname: string): ScreenId {
  const p = pathname.toLowerCase();
  if (p.endsWith('/play')) return 'play';
  if (p.endsWith('/shop')) return 'shop';
  if (p.endsWith('/settings')) return 'settings';
  if (p.endsWith('/profile')) return 'profile';
  if (p.endsWith('/leaderboard')) return 'leaderboard';
  return 'home';
}

function pathForScreen(screen: ScreenId): string {
  if (screen === 'home') return '/';
  return `/${screen}`;
}

function navigateTo(screen: ScreenId, push = true): void {
  currentScreen = screen;
  if (push) history.pushState({ screen }, '', pathForScreen(screen));
  render();
}

function getRankLabel(mmr: number): string {
  const index = Math.min(RANKS.length - 1, Math.floor(Math.max(0, mmr - 200) / 70));
  return RANKS[index] ?? 'Bronzo I';
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

function notify(text: string): void {
  const node = document.getElementById('notify');
  if (!node) return;
  node.textContent = text;
  node.classList.add('show');
  window.setTimeout(() => node.classList.remove('show'), 1600);
}

function renderHome(): string {
  return `
    <section class="hero">
      <h1>UNO ULTRAS DEFINITIVO</h1>
      <p>Beta demo completa: hub multipagina, modalita complete, progressione locale e gameplay UNO ricreato da zero.</p>
      <div class="hero-actions">
        <button data-action="goto" data-screen="play" class="btn-primary">Inizia a giocare</button>
        <button data-action="goto" data-screen="shop" class="btn-ghost">Apri Shop</button>
      </div>
    </section>
    <section class="grid three">
      <article class="panel"><h3>Modalita</h3><p>UNO, Ruba Mazzetto, Scopa, Poker, Burraco, Blackjack, Millemiglia, Scala 40 in 1v1/3/4.</p></article>
      <article class="panel"><h3>Classifica</h3><p>Sistema rank completo da Bronzo a SSL + MMR demo persistente.</p></article>
      <article class="panel"><h3>Beta pronta</h3><p>Interfaccia moderna, salvataggio locale e struttura pronta per integrazione feature monolite.</p></article>
    </section>
  `;
}

function renderGameMatrix(): string {
  const games = Object.entries(GAME_LABELS).map(([id, name]) => {
    const active = selectedGame === id;
    return `<button class="chip ${active ? 'active' : ''}" data-action="pick-game" data-game="${id}">${name}</button>`;
  });

  const modes = [2, 3, 4].map((value) => {
    const active = selectedPlayers === value;
    const label = value === 2 ? '1v1' : `${value} giocatori`;
    return `<button class="chip ${active ? 'active' : ''}" data-action="pick-players" data-players="${value}">${label}</button>`;
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

function renderUnoBoard(): string {
  if (!engine) return '';

  const state = engine.state;
  const topCard = state.discard[state.discard.length - 1];
  const me = state.players[0];

  const opponents = state.players
    .slice(1)
    .map((p, i) => `<div class="opponent ${state.currentPlayerIndex === i + 1 ? 'active' : ''}">${p.name}: ${p.hand.length} carte</div>`)
    .join('');

  const hand = me.hand
    .map((card, idx) => {
      const playable = state.currentPlayerIndex === 0 && engine?.getPlayableIndicesForCurrent().includes(idx);
      return `
        <button class="card ${colorClass(card.color)} ${playable ? 'playable' : ''}" data-action="play-card" data-index="${idx}" ${playable ? '' : 'disabled'}>
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
        <div class="deck" data-action="draw">PESCA</div>
        <div class="discard ${colorClass(topCard.color)}">${cardLabel(topCard)}</div>
      </div>
      <div class="hand">${hand}</div>
      <div class="game-actions">
        <button class="btn-ghost" data-action="say-uno">Dichiara UNO</button>
        <button class="btn-ghost" data-action="draw">Pesca Carta</button>
        <button class="btn-ghost" data-action="stop-game">Abbandona Match</button>
      </div>
      <div class="log">${gameLog.slice(0, 6).map((x) => `<div>${x}</div>`).join('')}</div>
    </section>
  `;
}

function renderPlay(): string {
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

function renderShop(): string {
  return `
    <section class="panel">
      <h2>Shop</h2>
      <p>Demo shop interna pronta per beta.</p>
      <div class="grid three">
        <article class="panel compact"><h4>Bundle Settimanale</h4><p>Skin tavolo + emote + titolo.</p><button class="btn-primary">Acquista 450</button></article>
        <article class="panel compact"><h4>Cassa Leggendaria</h4><p>Drop titoli premium e FX.</p><button class="btn-primary">Apri 800</button></article>
        <article class="panel compact"><h4>Token XP</h4><p>Boost progressione per 3 match.</p><button class="btn-primary">Attiva 120</button></article>
      </div>
    </section>
  `;
}

function renderSettings(): string {
  return `
    <section class="panel">
      <h2>Impostazioni</h2>
      <div class="setting-row"><span>Audio FX</span><span>80%</span></div>
      <div class="setting-row"><span>Musica</span><span>55%</span></div>
      <div class="setting-row"><span>Riduzione Motion</span><span>Off</span></div>
      <div class="setting-row"><span>Colorblind Mode</span><span>Off</span></div>
      <div class="setting-row"><span>NVDA Assist</span><span>On</span></div>
    </section>
  `;
}

function renderProfile(): string {
  return `
    <section class="panel">
      <h2>Profilo</h2>
      <div class="grid three">
        <article class="panel compact"><h4>Giocatore</h4><p>${profile.name}</p></article>
        <article class="panel compact"><h4>Partite</h4><p>${profile.games}</p></article>
        <article class="panel compact"><h4>Rank</h4><p>${getRankLabel(profile.mmr)} (${profile.mmr})</p></article>
      </div>
      <div class="grid two">
        <article class="panel compact"><h4>Win / Loss</h4><p>${profile.wins} / ${profile.losses}</p></article>
        <article class="panel compact"><h4>Crediti</h4><p>${profile.credits}</p></article>
      </div>
      <h4>Titoli</h4>
      <div class="chip-wrap">${profile.titles.map((t) => `<span class="chip active">${t}</span>`).join('')}</div>
    </section>
  `;
}

function renderLeaderboard(): string {
  const rows = RANKS.slice(0, 10)
    .map((rank, i) => `<tr><td>#${i + 1}</td><td>Player ${i + 1}</td><td>${rank}</td><td>${200 + i * 85}</td></tr>`)
    .join('');

  return `
    <section class="panel">
      <h2>Classifica Demo</h2>
      <table class="board">
        <thead><tr><th>Pos</th><th>Nome</th><th>Rank</th><th>MMR</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <h4>Titoli principali</h4>
      <div class="chip-wrap">${TITLES.map((t) => `<span class="chip">${t}</span>`).join('')}</div>
    </section>
  `;
}

function renderScreen(): string {
  switch (currentScreen) {
    case 'home':
      return renderHome();
    case 'play':
      return renderPlay();
    case 'shop':
      return renderShop();
    case 'settings':
      return renderSettings();
    case 'profile':
      return renderProfile();
    case 'leaderboard':
      return renderLeaderboard();
  }
}

function render(): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <h2>UNO ULTRAS</h2>
        <p>DEFINITIVO BETA</p>
        <nav>
          <button class="menu ${currentScreen === 'home' ? 'active' : ''}" data-action="goto" data-screen="home">Home</button>
          <button class="menu ${currentScreen === 'play' ? 'active' : ''}" data-action="goto" data-screen="play">Gioca</button>
          <button class="menu ${currentScreen === 'shop' ? 'active' : ''}" data-action="goto" data-screen="shop">Shop</button>
          <button class="menu ${currentScreen === 'settings' ? 'active' : ''}" data-action="goto" data-screen="settings">Impostazioni</button>
          <button class="menu ${currentScreen === 'profile' ? 'active' : ''}" data-action="goto" data-screen="profile">Profilo</button>
          <button class="menu ${currentScreen === 'leaderboard' ? 'active' : ''}" data-action="goto" data-screen="leaderboard">Classifica</button>
        </nav>
      </aside>
      <main class="content">${renderScreen()}</main>
    </div>
    <div id="notify" class="notify"></div>
  `;
}

function registerWin(isWin: boolean): void {
  profile.games += 1;
  if (isWin) {
    profile.wins += 1;
    profile.mmr += 18;
    profile.credits += 25;
    if (!profile.titles.includes('Leggenda di UNO') && profile.wins >= 5) {
      profile.titles.push('Leggenda di UNO');
    }
  } else {
    profile.losses += 1;
    profile.mmr = Math.max(200, profile.mmr - 8);
  }
  saveProfile();
}

function stopGame(): void {
  engine = null;
  gameLog = [];
  if (aiTimer) {
    window.clearTimeout(aiTimer);
    aiTimer = null;
  }
  render();
}

function runAiIfNeeded(): void {
  if (!engine || engine.state.winner) return;
  if (!engine.getCurrentPlayer().isAI) return;

  aiTimer = window.setTimeout(() => {
    if (!engine) return;
    const message = engine.runAI();
    if (message) gameLog.unshift(message);

    if (engine.state.winner) {
      const won = engine.state.winner === 'Tu';
      registerWin(won);
      notify(engine.state.winner === 'Tu' ? 'Hai vinto!' : `${engine.state.winner} vince!`);
      stopGame();
      return;
    }

    render();
    runAiIfNeeded();
  }, 850);
}

function startMode(): void {
  if (selectedGame !== 'uno') {
    notify(`${GAME_LABELS[selectedGame]} pronta come modulo beta UI. Gameplay completo in prossima fase.`);
    return;
  }

  engine = new UnoEngine(selectedPlayers);
  gameLog = [`Partita UNO avviata (${selectedPlayers === 2 ? '1v1' : `${selectedPlayers} giocatori`}).`];
  render();
  runAiIfNeeded();
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const actor = target.closest('[data-action]') as HTMLElement | null;
  if (!actor) return;

  const action = actor.dataset.action;

  if (action === 'goto' && actor.dataset.screen) {
    navigateTo(actor.dataset.screen as ScreenId);
    return;
  }

  if (action === 'pick-game' && actor.dataset.game) {
    selectedGame = actor.dataset.game as GameId;
    render();
    return;
  }

  if (action === 'pick-players' && actor.dataset.players) {
    selectedPlayers = Number(actor.dataset.players) as PlayersMode;
    render();
    return;
  }

  if (action === 'start-mode') {
    startMode();
    return;
  }

  if (action === 'draw' && engine && engine.state.currentPlayerIndex === 0) {
    const message = engine.drawForCurrent();
    gameLog.unshift(message);
    render();
    runAiIfNeeded();
    return;
  }

  if (action === 'say-uno' && engine && engine.state.currentPlayerIndex === 0) {
    engine.sayUno();
    gameLog.unshift('UNO dichiarato.');
    render();
    return;
  }

  if (action === 'play-card' && engine && engine.state.currentPlayerIndex === 0) {
    const index = Number(actor.dataset.index ?? '-1');
    const message = engine.playFromCurrent(index);
    gameLog.unshift(message);

    if (engine.state.winner) {
      registerWin(engine.state.winner === 'Tu');
      notify(engine.state.winner === 'Tu' ? 'Hai vinto!' : `${engine.state.winner} vince!`);
      stopGame();
      return;
    }

    render();
    runAiIfNeeded();
    return;
  }

  if (action === 'stop-game') {
    stopGame();
  }
});

window.addEventListener('popstate', () => {
  currentScreen = resolveScreenFromPath(location.pathname);
  render();
});

render();
