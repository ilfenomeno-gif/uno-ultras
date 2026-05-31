import './styles/main.scss';
import { render } from './core/renderer';
import { navigateTo, setRouterRenderCallback } from './core/router';
import { handlePlayAction, setPlayRenderCallback, setSelectedGame, setSelectedPlayers } from './screens/play';
import { handleSettingsInput } from './screens/settings';
import type { GameId, PlayersMode, ScreenId } from './game/types';

setRouterRenderCallback(render);
setPlayRenderCallback(render);

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const actor = target.closest('[data-action]') as HTMLElement | null;
  if (!actor) return;

  const action = actor.dataset.action;
  if (!action) return;
  if (action === 'goto' && actor.dataset.screen) return navigateTo(actor.dataset.screen as ScreenId);
  if (action === 'pick-game' && actor.dataset.game) return setSelectedGame(actor.dataset.game as GameId), render();
  if (action === 'pick-players' && actor.dataset.players) return setSelectedPlayers(Number(actor.dataset.players) as PlayersMode), render();
  handlePlayAction(action, actor);
});

document.addEventListener('input', (event) => {
  const target = event.target as HTMLElement;
  if (handleSettingsInput(target)) render();
});

document.addEventListener('change', (event) => {
  const target = event.target as HTMLElement;
  if (handleSettingsInput(target)) render();
});

render();
