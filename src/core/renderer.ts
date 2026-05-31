import { currentScreen } from './router';
import { renderHome } from '../screens/home';
import { renderPlay } from '../screens/play';
import { renderShop } from '../screens/shop';
import { renderSettings } from '../screens/settings';
import { renderProfile } from '../screens/profile';
import { renderLeaderboard } from '../screens/leaderboard';
import { profile } from './store';

export function renderScreen(): string {
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

export function render(): void {
  const app = document.getElementById('app');
  if (!app) return;

  const playerName = profile.name || 'Giocatore';
  const level = profile.mmr ?? 1;
  const avatarLetter = playerName.charAt(0).toUpperCase() || 'U';

  app.innerHTML = `
    <a href="#main-content" class="skip-link">Vai al contenuto</a>
    <div class="fn-layout">
      <div class="fn-bg" aria-hidden="true">
        <div class="fn-bg-gradient"></div>
      </div>

      <header class="fn-navbar" role="banner">
        <div class="fn-navbar-left">
          <span class="fn-logo">UNO<span class="fn-logo-accent">ULTRAS</span></span>
        </div>
        <nav class="fn-nav" role="navigation" aria-label="Navigazione principale">
          <button class="fn-tab ${currentScreen === 'home' ? 'active' : ''}" data-action="goto" data-screen="home">Home</button>
          <button class="fn-tab ${currentScreen === 'play' ? 'active' : ''}" data-action="goto" data-screen="play">Gioca</button>
          <button class="fn-tab ${currentScreen === 'shop' ? 'active' : ''}" data-action="goto" data-screen="shop">Shop</button>
          <button class="fn-tab ${currentScreen === 'settings' ? 'active' : ''}" data-action="goto" data-screen="settings">Impostazioni</button>
          <button class="fn-tab ${currentScreen === 'profile' ? 'active' : ''}" data-action="goto" data-screen="profile">Profilo</button>
          <button class="fn-tab ${currentScreen === 'leaderboard' ? 'active' : ''}" data-action="goto" data-screen="leaderboard">Classifica</button>
        </nav>
        <div class="fn-navbar-right">
          <div class="fn-profile-badge" id="fn-profile-badge">
            <div class="fn-avatar" aria-hidden="true">${avatarLetter}</div>
            <div class="fn-profile-info">
              <span class="fn-username" id="fn-username">${playerName}</span>
              <span class="fn-level" id="fn-level">LVL ${level}</span>
            </div>
          </div>
        </div>
      </header>

      <main class="fn-content" id="main-content" tabindex="-1">${renderScreen()}</main>
      <div class="fn-level-badge" aria-label="Livello giocatore" id="fn-level-badge">
        <span>LVL</span>
        <span id="fn-level-num">${level}</span>
      </div>
    </div>
    <div id="notify" role="status" aria-live="polite"></div>
  `;
}
