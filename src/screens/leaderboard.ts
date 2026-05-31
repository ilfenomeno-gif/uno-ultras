import { RANKS, TITLES } from '../core/store';

export function renderLeaderboard(): string {
  const rows = RANKS.slice(0, 10)
    .map((rank, i) => `<tr><td>#${i + 1}</td><td>Player ${i + 1}</td><td>${rank}</td><td>${200 + i * 85}</td></tr>`)
    .join('');

  return `
    <section class="panel">
      <h2>Classifica Demo</h2>
      <table class="board" aria-label="Classifica demo locale">
        <thead><tr><th>Pos</th><th>Nome</th><th>Rank</th><th>MMR</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <h4>Titoli principali</h4>
      <div class="chip-wrap">${TITLES.map((t) => `<span class="chip">${t}</span>`).join('')}</div>
    </section>
  `;
}
