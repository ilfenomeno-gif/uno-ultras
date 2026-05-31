import type { UnoEngine } from './uno';

export let aiTimer: number | null = null;

export function clearAiTimer(): void {
  if (aiTimer) {
    window.clearTimeout(aiTimer);
    aiTimer = null;
  }
}

type RunAiOptions = {
  engine: UnoEngine;
  onMessage: (message: string) => void;
  onWin: (winner: string) => void;
  onRender: () => void;
};

export function runAiIfNeeded(options: RunAiOptions | null): void {
  if (!options) return;
  const { engine, onMessage, onWin, onRender } = options;
  if (engine.state.winner) return;
  if (!engine.getCurrentPlayer().isAI) return;

  clearAiTimer();
  aiTimer = window.setTimeout(() => {
    const message = engine.runAI();
    if (message) onMessage(message);

    if (engine.state.winner) {
      onWin(engine.state.winner);
      return;
    }

    onRender();
    runAiIfNeeded({ engine, onMessage, onWin, onRender });
  }, 850);
}
