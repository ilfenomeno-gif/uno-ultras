export function renderLoadingScreen(gameLabel: string, onDone: () => void): string {
  const tips = [
    'Prepara la tua strategia!',
    'Le carte non mentono mai.',
    'La fortuna aiuta gli audaci.',
    'Ogni mossa conta.',
    'Ricorda: UNO va dichiarato!',
    "Studia le mosse dell'avversario.",
    "Il bluff e un'arte.",
    'Conosci le regole, poi infrangile.'
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)] ?? tips[0];

  window.setTimeout(onDone, 2200);

  return `
    <div class="fn-loading" id="fn-loading">
      <div class="fn-loading-bg"></div>
      <div class="fn-loading-content">
        <div class="fn-loading-icon">🃏</div>
        <h1 class="fn-loading-title">${gameLabel.toUpperCase()}</h1>
        <div class="fn-loading-bar-wrap">
          <div class="fn-loading-bar" id="fn-loading-bar"></div>
        </div>
        <p class="fn-loading-tip">${tip}</p>
      </div>
    </div>
  `;
}
