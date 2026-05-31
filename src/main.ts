import './styles/main.scss';
import { notify } from './core/notify';
import { profile, saveProfile } from './core/store';
import { handlePlayAction, setPlayRenderCallback, setSelectedGame, setSelectedMode, setSelectedPlayers, startMode, stopGame } from './screens/play';
import { handleSettingsInput } from './screens/settings';
import { renderActiveBoard, setBoardRenderCallback, startLoading, isLoading } from './screens/render-board';
import type { GameId, GameMode, HubScreen, PlayersMode } from './game/types';

type ModalTab = 'modalita' | 'giocatori';

let currentHub: HubScreen = 'gioca';
let modalOpen = false;
let modalTab: ModalTab = 'modalita';
let newsSlideIndex = 0;
let selectedGameId: GameId = 'uno';
let selectedPlayersNum: PlayersMode = 2;
let selectedModeStr: GameMode = 'single';

const NEWS_ITEMS = [
  { tag: 'NUOVO', titolo: 'AGGIORNAMENTO 1.0', desc: 'UNO Ultras e live! Gioca in single e multiplayer locale.', color: '#7c3aed' },
  { tag: 'EVENTO', titolo: 'WEEKEND XP DOPPIO', desc: 'Guadagna il doppio degli XP questo weekend su tutte le modalita.', color: '#f5c518' },
  { tag: 'NUOVO', titolo: 'RUBA MAZZETTO', desc: 'La modalita Ruba Mazzetto e in arrivo. Stay tuned!', color: '#e63535' },
  { tag: 'NEGOZIO', titolo: 'BUNDLE LEGGENDARIO', desc: 'Bundle esclusivo disponibile per 48 ore nello shop.', color: '#ff6b00' },
  { tag: 'SFIDA', titolo: 'MISSIONE SETTIMANALE', desc: 'Vinci 3 partite questa settimana per sbloccare il titolo ELITE.', color: '#2ecc71' }
];

const GAME_MODES: Array<{ id: GameId; label: string; desc: string }> = [
  { id: 'uno', label: 'UNO', desc: '1v1 vs AI o locale' },
  { id: 'ruba', label: 'RUBA MAZZETTO', desc: '2-4 giocatori' },
  { id: 'scopa', label: 'SCOPA', desc: '2 giocatori' },
  { id: 'briscola', label: 'BRISCOLA', desc: '2-4 giocatori' },
  { id: 'scala40', label: 'SCALA 40', desc: '2-4 giocatori' },
  { id: 'burraco', label: 'BURRACO', desc: '2-4 giocatori' },
  { id: 'poker', label: 'POKER', desc: '2-4 giocatori' },
  { id: 'blackjack', label: 'BLACKJACK', desc: 'vs Dealer AI' },
  { id: 'millemiglia', label: 'MILLE MIGLIA', desc: '2-4 giocatori' },
  { id: 'tressette', label: 'TRESSETTE', desc: '2-4 giocatori' }
];

const PLAYERS_OPTIONS = [
  { value: 2 as PlayersMode, label: '1V1', sub: '2 giocatori' },
  { value: 3 as PlayersMode, label: '3 GIOCATORI', sub: 'Hot seat' },
  { value: 4 as PlayersMode, label: '4 GIOCATORI', sub: 'Hot seat' }
];

const HUB_TABS: Array<{ id: HubScreen; label: string }> = [
  { id: 'gioca', label: 'GIOCA' },
  { id: 'negozio', label: 'NEGOZIO' },
  { id: 'armadietto', label: 'ARMADIETTO' },
  { id: 'battle-card', label: 'BATTLE CARD' },
  { id: 'sfide', label: 'SFIDE' },
  { id: 'carriera', label: 'CARRIERA' },
  { id: 'v-card', label: 'V-CARD' }
];

function getLevel(): number {
  return Math.max(1, Math.floor((profile.mmr ?? 200) / 50));
}

function renderNavbar(): void {
  const nav = document.getElementById('fn-nav');
  if (!nav) return;
  nav.innerHTML = HUB_TABS.map((t) => `<button class="fn-tab ${currentHub === t.id ? 'active' : ''}" data-action="switch-hub" data-hub="${t.id}" aria-pressed="${currentHub === t.id}">${t.label}</button>`).join('');
}

function renderProfileBadge(): void {
  const username = document.getElementById('fn-username');
  const avatar = document.getElementById('fn-avatar');
  const lvlNum = document.getElementById('fn-level-num');
  if (username) username.textContent = profile.name || 'Giocatore';
  if (avatar) avatar.textContent = (profile.name || 'G').charAt(0).toUpperCase();
  if (lvlNum) lvlNum.textContent = String(getLevel());

  const badge = document.getElementById('fn-level-badge');
  if (badge) badge.classList.toggle('visible', currentHub === 'gioca');
}

function renderGioca(): string {
  const activeGame = (window as any).__activeGame as GameId | null;
  if (activeGame || isLoading()) {
    return `<div class="fn-game-wrapper">${renderActiveBoard(activeGame ?? 'uno')}</div>`;
  }

  const news = NEWS_ITEMS.map(
    (n, i) => `
      <div class="fn-news-card ${i === newsSlideIndex ? 'active' : ''}" data-news-idx="${i}">
        <span class="fn-news-tag" style="background:${n.color}">${n.tag}</span>
        <div class="fn-news-body">
          <strong>${n.titolo}</strong>
          <p>${n.desc}</p>
        </div>
      </div>
    `
  ).join('');

  return `
    <div class="fn-gioca-layout">
      <div class="fn-news-strip" role="region" aria-label="Notizie">
        <div class="fn-news-scroll" id="fn-news-scroll">${news}</div>
        <div class="fn-news-arrows">
          <button class="fn-news-arrow" data-action="news-prev" aria-label="Precedente">&#8249;</button>
          <div class="fn-news-dots">
            ${NEWS_ITEMS.map((_, i) => `<span class="fn-news-dot ${i === newsSlideIndex ? 'active' : ''}" data-action="news-goto" data-idx="${i}"></span>`).join('')}
          </div>
          <button class="fn-news-arrow" data-action="news-next" aria-label="Successivo">&#8250;</button>
        </div>
      </div>

      <div class="fn-play-panel">
        <div class="fn-play-panel-inner">
          <div class="fn-play-mode-label"><span class="fn-play-game-name" id="fn-play-game-name">UNO</span></div>
          <button class="fn-mode-selector-btn" data-action="open-modal" aria-haspopup="dialog">
            <span class="fn-mode-icon">⊞</span>
            <span id="fn-mode-display">Singleplayer · 1v1</span>
            <span class="fn-mode-arrow">›</span>
          </button>
          <button class="fn-play-btn btn-primary" data-action="fn-start">GIOCA</button>
        </div>
      </div>
    </div>
  `;
}

function renderNegozio(): string {
  const reparti = [
    {
      nome: 'ARTICOLI IN EVIDENZA',
      items: [
        { id: 'bundle-weekly', nome: 'Bundle Settimanale', tipo: 'Bundle', costo: 450, emoji: '🎁', rarity: 'epic' },
        { id: 'cassa-legend', nome: 'Cassa Leggendaria', tipo: 'Cassa', costo: 800, emoji: '🏆', rarity: 'legendary' },
        { id: 'token-xp', nome: 'Token XP x5', tipo: 'Boost', costo: 120, emoji: '⚡', rarity: 'uncommon' },
        { id: 'skin-asso', nome: 'Skin Asso di Picche', tipo: 'Skin', costo: 350, emoji: '♠️', rarity: 'rare' }
      ]
    },
    {
      nome: 'TARGHETTE',
      items: [
        { id: 'tag-elite', nome: 'Targhetta ELITE', tipo: 'Targhetta', costo: 200, emoji: '🔱', rarity: 'epic' },
        { id: 'tag-legend', nome: 'Targhetta LEGGENDA', tipo: 'Targhetta', costo: 500, emoji: '👑', rarity: 'legendary' },
        { id: 'tag-rookie', nome: 'Targhetta ROOKIE', tipo: 'Targhetta', costo: 80, emoji: '🌱', rarity: 'common' }
      ]
    }
  ];

  return `
    <div class="fn-screen fn-negozio">
      <div class="fn-screen-header">
        <h1>NEGOZIO</h1>
        <div class="fn-credits-display"><span class="fn-vcoin">V</span><span>${profile.credits}</span></div>
      </div>
      <div class="fn-shop-body">
        ${reparti
          .map(
            (r) => `
          <section class="fn-shop-reparto">
            <h2 class="fn-reparto-title">${r.nome}</h2>
            <div class="fn-shop-grid">
              ${r.items
                .map(
                  (item) => `
                <div class="fn-shop-card rarity-${item.rarity}">
                  <div class="fn-shop-emoji">${item.emoji}</div>
                  <div class="fn-shop-info">
                    <span class="fn-shop-tipo">${item.tipo}</span>
                    <strong class="fn-shop-nome">${item.nome}</strong>
                  </div>
                  <button class="fn-shop-buy" data-action="buy-item" data-cost="${item.costo}" data-item-id="${item.id}"><span class="fn-vcoin-small">V</span> ${item.costo}</button>
                </div>
              `
                )
                .join('')}
            </div>
          </section>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderArmadietto(): string {
  const items = profile.titles.map((t) => ({ nome: t, emoji: '🔱', owned: true }));
  const extra = [
    { nome: 'CAMPIONE', emoji: '🏆', owned: false },
    { nome: 'LEGGENDA', emoji: '👑', owned: false },
    { nome: 'INVITTO', emoji: '⚔️', owned: false }
  ];

  return `
    <div class="fn-screen fn-armadietto">
      <div class="fn-screen-header"><h1>ARMADIETTO</h1></div>
      <div class="fn-armad-body">
        <section class="fn-armad-sezione">
          <h2 class="fn-reparto-title">TARGHETTE</h2>
          <div class="fn-armad-grid">
            ${[...items, ...extra]
              .map(
                (item) => `
              <div class="fn-armad-slot ${item.owned ? 'owned' : 'locked'}" title="${item.nome}">
                <span class="fn-armad-emoji">${item.emoji}</span>
                <span class="fn-armad-label">${item.nome}</span>
                ${!item.owned ? '<div class="fn-lock">🔒</div>' : ''}
              </div>
            `
              )
              .join('')}
          </div>
        </section>
      </div>
    </div>
  `;
}

function renderBattleCard(): string {
  const playerLevel = getLevel();
  const totalLevels = 50;
  const items = Array.from({ length: totalLevels }, (_, i) => ({ lvl: i + 1, nome: `Reward ${i + 1}`, emoji: i % 2 === 0 ? '⚡' : '🎁' }));

  return `
    <div class="fn-screen fn-battlecard">
      <div class="fn-bc-header">
        <div class="fn-bc-title-area">
          <h1>BATTLE CARD</h1>
          <p>Avanza di livello per sbloccare ricompense esclusive</p>
        </div>
        <div class="fn-bc-level-badge">LVL <strong>${playerLevel}</strong></div>
        <button class="fn-bc-upgrade-btn" data-action="open-battlecard-upgrade">🏆 POTENZIA</button>
      </div>
      <div class="fn-bc-progress-area">
        <div class="fn-bc-progress-bar"><div class="fn-bc-progress-fill" style="width:${Math.min(100, (playerLevel / totalLevels) * 100)}%"></div></div>
        <span class="fn-bc-progress-label">${profile.mmr ?? 200} XP</span>
      </div>
      <div class="fn-bc-track-wrap"><div class="fn-bc-track">${items
        .map(
          (item) => `
        <div class="fn-bc-item ${item.lvl <= playerLevel ? 'unlocked' : 'locked'}">
          <div class="fn-bc-item-icon">${item.emoji}</div>
          <div class="fn-bc-item-name">${item.nome}</div>
          <div class="fn-bc-item-lvl">${item.lvl}</div>
        </div>
      `
        )
        .join('')}</div></div>
    </div>
  `;
}

function renderSfide(): string {
  const missioni = [
    { nome: 'Prima vittoria', req: 1, prog: Math.min(1, profile.wins), xp: 100 },
    { nome: 'Tre vittorie', req: 3, prog: Math.min(3, profile.wins), xp: 200 },
    { nome: 'Dieci partite', req: 10, prog: Math.min(10, profile.games), xp: 150 },
    { nome: 'Cinque vittorie', req: 5, prog: Math.min(5, profile.wins), xp: 300 }
  ];

  return `
    <div class="fn-screen fn-sfide">
      <div class="fn-screen-header"><h1>SFIDE</h1><p>Completa le missioni per guadagnare XP</p></div>
      <div class="fn-sfide-list">
        ${missioni
          .map((m) => {
            const done = m.prog >= m.req;
            const pct = Math.min(100, (m.prog / m.req) * 100);
            return `
            <div class="fn-missione ${done ? 'done' : ''}">
              <div class="fn-missione-icon">${done ? '✅' : '🎯'}</div>
              <div class="fn-missione-info">
                <strong class="fn-missione-nome">${m.nome}</strong>
                <div class="fn-missione-bar"><div class="fn-missione-fill" style="width:${pct}%"></div></div>
                <span class="fn-missione-prog">${m.prog}/${m.req}</span>
              </div>
              <div class="fn-missione-xp"><span>+${m.xp}</span><small>XP</small></div>
            </div>
          `;
          })
          .join('')}
      </div>
    </div>
  `;
}

function renderCarriera(): string {
  const winrate = profile.games > 0 ? Math.round((profile.wins / profile.games) * 100) : 0;

  return `
    <div class="fn-screen fn-carriera">
      <div class="fn-screen-header"><h1>CARRIERA</h1></div>
      <div class="fn-career-stats">
        <div class="fn-career-rank"><span class="fn-rank-emoji">🏆</span><span class="fn-rank-nome">LIVELLO ${getLevel()}</span><span class="fn-rank-mmr">${profile.mmr} MMR</span></div>
        <div class="fn-career-grid">
          <div class="fn-career-stat"><span class="fn-stat-val">${profile.games}</span><span class="fn-stat-label">PARTITE</span></div>
          <div class="fn-career-stat"><span class="fn-stat-val">${profile.wins}</span><span class="fn-stat-label">VITTORIE</span></div>
          <div class="fn-career-stat"><span class="fn-stat-val">${profile.losses}</span><span class="fn-stat-label">SCONFITTE</span></div>
          <div class="fn-career-stat"><span class="fn-stat-val">${winrate}%</span><span class="fn-stat-label">WINRATE</span></div>
        </div>
      </div>
      <div class="panel">
        <h3>Profilo</h3>
        <div class="setting-row"><label for="profile-name">Nome Giocatore</label><input type="text" id="profile-name" value="${profile.name}" maxlength="20" aria-label="Nome del giocatore" data-profile-field="name" /></div>
      </div>
    </div>
  `;
}

function renderVCard(): string {
  const pacchetti = [
    { id: 'vc-100', label: '100', emoji: '💛', price: '0.99€', popular: false },
    { id: 'vc-500', label: '500', emoji: '💛💛', price: '3.99€', popular: false },
    { id: 'vc-1000', label: '1.000', emoji: '🏆', price: '6.99€', popular: true }
  ];

  return `
    <div class="fn-screen fn-vcard">
      <div class="fn-screen-header"><h1>V-CARD</h1><p>Acquista V-Card per sbloccare contenuti esclusivi nel Negozio</p></div>
      <div class="fn-vc-saldo"><span class="fn-vcoin large">V</span><span class="fn-vc-amount">${profile.credits}</span><span class="fn-vc-label">V-CARD DISPONIBILI</span></div>
      <div class="fn-vc-grid">
        ${pacchetti
          .map(
            (p) => `
          <div class="fn-vc-card ${p.popular ? 'popular' : ''}">
            ${p.popular ? '<div class="fn-vc-popular-tag">PIU POPOLARE</div>' : ''}
            <div class="fn-vc-emoji">${p.emoji}</div>
            <div class="fn-vc-amount-label"><span class="fn-vcoin-sm">V</span><strong>${p.label}</strong></div>
            <button class="fn-vc-buy-btn" data-action="buy-vc" data-vc-id="${p.id}" data-price="${p.price}">${p.price}</button>
          </div>
        `
          )
          .join('')}
      </div>
      <p class="fn-vc-disclaimer">Le V-Card sono valuta di gioco demo. Nessun addebito reale.</p>
    </div>
  `;
}

function renderHub(): void {
  const main = document.getElementById('fn-main');
  if (!main) return;

  renderNavbar();
  renderProfileBadge();

  if (currentHub === 'gioca') main.innerHTML = renderGioca();
  if (currentHub === 'negozio') main.innerHTML = renderNegozio();
  if (currentHub === 'armadietto') main.innerHTML = renderArmadietto();
  if (currentHub === 'battle-card') main.innerHTML = renderBattleCard();
  if (currentHub === 'sfide') main.innerHTML = renderSfide();
  if (currentHub === 'carriera') main.innerHTML = renderCarriera();
  if (currentHub === 'v-card') main.innerHTML = renderVCard();

  setPlayRenderCallback(renderHub);
  setBoardRenderCallback(renderHub);
  updateModeDisplay();
}

function renderModal(): void {
  const modal = document.getElementById('fn-modal');
  if (!modal) return;

  const isModalita = modalTab === 'modalita';
  modal.innerHTML = `
    <div class="fn-modal-header">
      <h2>SELEZIONA MODALITA</h2>
      <button class="fn-modal-close" data-action="close-modal" aria-label="Chiudi">✕</button>
    </div>
    <div class="fn-modal-tabs">
      <button class="fn-modal-tab ${isModalita ? 'active' : ''}" data-action="modal-tab" data-tab="modalita">MODALITA</button>
      <button class="fn-modal-tab ${!isModalita ? 'active' : ''}" data-action="modal-tab" data-tab="giocatori">GIOCATORI</button>
    </div>
    <div class="fn-modal-body">
      ${
        isModalita
          ? `<div class="fn-modal-modes">${GAME_MODES.map((g) => `<button class="fn-modal-mode-item ${selectedGameId === g.id ? 'active' : ''}" data-action="modal-pick-game" data-game="${g.id}"><strong>${g.label}</strong><span>${g.desc}</span></button>`).join('')}</div>`
          : `<div class="fn-modal-players">${PLAYERS_OPTIONS.map((p) => `<button class="fn-modal-player-item ${selectedPlayersNum === p.value ? 'active' : ''}" data-action="modal-pick-players" data-players="${p.value}"><strong>${p.label}</strong><span>${p.sub}</span></button>`).join('')}
              <div class="fn-modal-mode-row">
                <span>Modalita:</span>
                <div class="fn-modal-mode-toggle">
                  <button class="${selectedModeStr === 'single' ? 'active' : ''}" data-action="modal-pick-mode" data-mode="single">VS AI</button>
                  <button class="${selectedModeStr === 'local' ? 'active' : ''}" data-action="modal-pick-mode" data-mode="local">LOCALE</button>
                </div>
              </div>
            </div>`
      }
    </div>
    <div class="fn-modal-footer"><button class="btn-primary fn-modal-confirm" data-action="modal-confirm">CONFERMA</button></div>
  `;
}

function openModal(): void {
  const overlay = document.getElementById('fn-modal-overlay');
  if (!overlay) return;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  modalOpen = true;
  renderModal();
}

function closeModal(): void {
  const overlay = document.getElementById('fn-modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  modalOpen = false;
  updateModeDisplay();
}

function updateModeDisplay(): void {
  const display = document.getElementById('fn-mode-display');
  const gameName = document.getElementById('fn-play-game-name');
  const label = GAME_MODES.find((g) => g.id === selectedGameId)?.label ?? 'UNO';
  const playerLabel = selectedModeStr === 'single' ? 'Singleplayer · 1v1' : `Locale · ${selectedPlayersNum} giocatori`;
  if (display) display.textContent = `${label} · ${playerLabel}`;
  if (gameName) gameName.textContent = label;
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const actor = target.closest('[data-action]') as HTMLElement | null;
  if (!actor) return;
  const action = actor.dataset.action;
  if (!action) return;

  if (action === 'switch-hub' && actor.dataset.hub) {
    currentHub = actor.dataset.hub as HubScreen;
    renderHub();
    return;
  }

  if (action === 'goto' && actor.dataset.screen === 'profile') {
    currentHub = 'carriera';
    renderHub();
    return;
  }

  if (action === 'news-prev') {
    newsSlideIndex = (newsSlideIndex - 1 + NEWS_ITEMS.length) % NEWS_ITEMS.length;
    renderHub();
    return;
  }
  if (action === 'news-next') {
    newsSlideIndex = (newsSlideIndex + 1) % NEWS_ITEMS.length;
    renderHub();
    return;
  }
  if (action === 'news-goto' && actor.dataset.idx) {
    newsSlideIndex = Number(actor.dataset.idx);
    renderHub();
    return;
  }

  if (action === 'open-modal') return openModal();
  if (action === 'close-modal') return closeModal();
  if (action === 'modal-tab' && actor.dataset.tab) {
    modalTab = actor.dataset.tab as ModalTab;
    renderModal();
    return;
  }
  if (action === 'modal-pick-game' && actor.dataset.game) {
    selectedGameId = actor.dataset.game as GameId;
    renderModal();
    return;
  }
  if (action === 'modal-pick-players' && actor.dataset.players) {
    selectedPlayersNum = Number(actor.dataset.players) as PlayersMode;
    renderModal();
    return;
  }
  if (action === 'modal-pick-mode' && actor.dataset.mode) {
    selectedModeStr = actor.dataset.mode as GameMode;
    renderModal();
    return;
  }
  if (action === 'modal-confirm') {
    setSelectedGame(selectedGameId);
    setSelectedMode(selectedModeStr);
    setSelectedPlayers(selectedPlayersNum);
    closeModal();
    return;
  }

  if (action === 'fn-start') {
    setSelectedGame(selectedGameId);
    setSelectedMode(selectedModeStr);
    setSelectedPlayers(selectedPlayersNum);
    startMode();
    (window as any).__activeGame = selectedGameId;
    (window as any).__bjPhase = 'bet';
    (window as any).__bjBet = 10;
    startLoading(selectedGameId, renderHub);
    renderHub();
    return;
  }

  if (action === 'stop-game') {
    stopGame();
    (window as any).__activeGame = null;
    renderHub();
    return;
  }

  if (action === 'draw-card') {
    handlePlayAction('draw', actor);
    return;
  }
  if (action === 'declare-uno') {
    handlePlayAction('say-uno', actor);
    return;
  }

  if (action === 'bj-set-bet') {
    (window as any).__bjBet = Number(actor.dataset.amount ?? 10);
    renderHub();
    return;
  }
  if (action === 'bj-bet-half') {
    (window as any).__bjBet = Math.floor(profile.credits / 2);
    renderHub();
    return;
  }
  if (action === 'bj-bet-all') {
    (window as any).__bjBet = profile.credits;
    renderHub();
    return;
  }
  if (action === 'bj-deal') {
    (window as any).__bjPhase = 'play';
    renderHub();
    return;
  }
  if (action === 'bj-hit' || action === 'bj-stand' || action === 'bj-double') {
    (window as any).__bjPhase = 'result';
    renderHub();
    return;
  }
  if (action === 'bj-restart') {
    (window as any).__bjPhase = 'bet';
    (window as any).__bjBet = 10;
    renderHub();
    return;
  }

  if (action === 'sort-hand') {
    notify('Mano riordinata per colore!');
    renderHub();
    return;
  }

  if (action === 'buy-item') {
    const cost = Number(actor.dataset.cost ?? '0');
    const itemId = actor.dataset.itemId ?? '';
    if (profile.credits >= cost) {
      profile.credits -= cost;
      if (itemId === 'bundle-weekly' && !profile.titles.includes('Maestro di Scala 40')) {
        profile.titles.push('Maestro di Scala 40');
      }
      saveProfile();
      notify(`Acquisto completato! Crediti rimanenti: ${profile.credits}`);
      renderHub();
      return;
    }
    notify(`Crediti insufficienti! Ti mancano ${Math.max(0, cost - profile.credits)} crediti.`);
    return;
  }

  if (action === 'buy-vc') {
    notify('Acquisto demo non disponibile. Le V-Card sono simulate.');
    return;
  }

  if (action === 'back-to-hub') {
    (window as any).__activeGame = null;
    (window as any).__bjPhase = null;
    currentHub = 'gioca';
    renderHub();
    return;
  }

  if (action === 'play-again') {
    const game = ((window as any).__activeGame as GameId) ?? 'uno';
    startLoading(game, renderHub);
    renderHub();
    return;
  }

  if (modalOpen) {
    const overlay = document.getElementById('fn-modal-overlay');
    if (target === overlay) closeModal();
  }

  handlePlayAction(action, actor);
});

document.addEventListener('input', (event) => {
  const target = event.target as HTMLElement;
  const profileField = (target as HTMLInputElement).dataset.profileField;
  if (profileField === 'name') {
    profile.name = ((target as HTMLInputElement).value || '').trim() || 'Giocatore';
    saveProfile();
    renderProfileBadge();
    return;
  }
  if (handleSettingsInput(target)) renderHub();
});

document.addEventListener('change', (event) => {
  const target = event.target as HTMLElement;
  if (handleSettingsInput(target)) renderHub();
});

const modalOverlay = document.getElementById('fn-modal-overlay');
if (modalOverlay) {
  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) closeModal();
  });
}

setPlayRenderCallback(renderHub);
setBoardRenderCallback(renderHub);
(window as any).__activeGame = null;
renderHub();
