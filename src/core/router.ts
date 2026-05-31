import type { ScreenId } from '../game/types';
import { stopGame } from '../screens/play';

export let currentScreen: ScreenId = resolveScreenFromPath(location.pathname);

let renderCallback: (() => void) | null = null;

export function setRouterRenderCallback(callback: () => void): void {
  renderCallback = callback;
}

export function resolveScreenFromPath(pathname: string): ScreenId {
  const p = pathname.toLowerCase();
  if (p.endsWith('/play')) return 'play';
  if (p.endsWith('/shop')) return 'shop';
  if (p.endsWith('/settings')) return 'settings';
  if (p.endsWith('/profile')) return 'profile';
  if (p.endsWith('/leaderboard')) return 'leaderboard';
  return 'home';
}

export function pathForScreen(screen: ScreenId): string {
  if (screen === 'home') return '/';
  return `/${screen}`;
}

export function navigateTo(screen: ScreenId, push = true): void {
  const leavingPlay = currentScreen === 'play' && screen !== 'play';
  currentScreen = screen;
  if (push) history.pushState({ screen }, '', pathForScreen(screen));
  if (leavingPlay) {
    stopGame();
    return;
  }
  renderCallback?.();
}

window.addEventListener('popstate', () => {
  const nextScreen = resolveScreenFromPath(location.pathname);
  const leavingPlay = currentScreen === 'play' && nextScreen !== 'play';
  currentScreen = nextScreen;

  if (leavingPlay) {
    stopGame();
    return;
  }

  renderCallback?.();
});
