export interface GameResult {
  outcome: 'win' | 'loss' | 'draw';
  mmrDelta: number;
  xpGained: number;
  gameName: string;
}

export function renderResultOverlay(result: GameResult): string {
  const config = {
    win: { title: '🏆 VITTORIA!', color: '#f5c518', bg: 'rgba(245,197,24,0.12)' },
    loss: { title: '💀 SCONFITTA', color: '#e63535', bg: 'rgba(230,53,53,0.12)' },
    draw: { title: '🤝 PAREGGIO', color: '#00d4ff', bg: 'rgba(0,212,255,0.12)' }
  }[result.outcome];

  return `
    <div class="fn-result-overlay" style="--result-color:${config.color};--result-bg:${config.bg}" role="dialog" aria-modal="true" aria-label="Risultato partita">
      <div class="fn-result-panel">
        <h1 class="fn-result-title">${config.title}</h1>
        <p class="fn-result-game">${result.gameName.toUpperCase()}</p>
        <div class="fn-result-stats">
          <div class="fn-result-stat">
            <span class="fn-stat-val ${result.mmrDelta >= 0 ? 'pos' : 'neg'}">${result.mmrDelta >= 0 ? '+' : ''}${result.mmrDelta}</span>
            <span class="fn-stat-label">MMR</span>
          </div>
          <div class="fn-result-stat">
            <span class="fn-stat-val pos">+${result.xpGained}</span>
            <span class="fn-stat-label">XP</span>
          </div>
        </div>
        <div class="fn-result-actions">
          <button class="btn-primary" style="width:auto;padding:12px 36px" data-action="play-again">GIOCA ANCORA</button>
          <button class="btn-ghost" data-action="back-to-hub">TORNA AL MENU</button>
        </div>
      </div>
    </div>
  `;
}
