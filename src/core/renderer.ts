import { currentScreen } from './router';
import { renderHome } from '../screens/home';
import { renderPlay } from '../screens/play';
import { renderShop } from '../screens/shop';
import { renderSettings } from '../screens/settings';
import { renderProfile } from '../screens/profile';
import { renderLeaderboard } from '../screens/leaderboard';

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
