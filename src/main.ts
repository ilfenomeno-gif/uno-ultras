import './styles/main.scss';
import { notify } from './core/notify';
import { render } from './core/renderer';
import { navigateTo, setRouterRenderCallback } from './core/router';
import { profile, saveProfile } from './core/store';
import { handlePlayAction, setPlayRenderCallback, setSelectedGame, setSelectedMode, setSelectedPlayers } from './screens/play';
import { handleSettingsInput } from './screens/settings';
import type { GameId, GameMode, PlayersMode, ScreenId } from './game/types';

setRouterRenderCallback(render);
setPlayRenderCallback(render);

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const actor = target.closest('[data-action]') as HTMLElement | null;
  if (!actor) return;

  const action = actor.dataset.action;
  if (!action) return;
  if (action === 'goto' && actor.dataset.screen) return navigateTo(actor.dataset.screen as ScreenId);
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
      return render();
    }

    notify(`Crediti insufficienti! Ti mancano ${Math.max(0, cost - profile.credits)} crediti.`);
    return;
  }
  if (action === 'select-title' && actor.dataset.title) {
    profile.activeTitle = actor.dataset.title;
    profile.activeTitleIndex = Math.max(0, profile.titles.indexOf(profile.activeTitle));
    saveProfile();
    return render();
  }
  if (action === 'pick-mode' && actor.dataset.mode) return setSelectedMode(actor.dataset.mode as GameMode), render();
  if (action === 'pick-game' && actor.dataset.game) return setSelectedGame(actor.dataset.game as GameId), render();
  if (action === 'pick-players' && actor.dataset.players) return setSelectedPlayers(Number(actor.dataset.players) as PlayersMode), render();
  handlePlayAction(action, actor);
});

document.addEventListener('input', (event) => {
  const target = event.target as HTMLElement;
  const profileField = (target as HTMLInputElement).dataset.profileField;
  if (profileField === 'name') {
    profile.name = ((target as HTMLInputElement).value || '').trim() || 'Giocatore';
    saveProfile();

    const fnUsername = document.getElementById('fn-username');
    const fnAvatar = document.querySelector('.fn-avatar');
    if (fnUsername) fnUsername.textContent = profile.name;
    if (fnAvatar) fnAvatar.textContent = profile.name.charAt(0).toUpperCase() || 'U';

    return;
  }
  if (handleSettingsInput(target)) render();
});

document.addEventListener('change', (event) => {
  const target = event.target as HTMLElement;
  if (handleSettingsInput(target)) render();
});

render();
