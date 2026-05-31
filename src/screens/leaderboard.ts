import { getRankLabel, profile } from '../core/store';

export function renderLeaderboard(): string {
  return `
    <section class="panel">
      <h2>Classifica Locale</h2>
      <table class="board" aria-label="Classifica demo locale">
        <thead><tr><th>Pos</th><th>Nome</th><th>Rank</th><th>MMR</th></tr></thead>
        <tbody><tr><td>#1</td><td>${profile.name}</td><td>${getRankLabel(profile.mmr)}</td><td>${profile.mmr}</td></tr></tbody>
      </table>
      <p>Classifica online non disponibile in modalita locale.</p>
    </section>
    <section class="panel">
      <h3>I miei record</h3>
      <div class="grid three">
        <article class="panel compact"><h4>Partite giocate</h4><p>${profile.games}</p></article>
        <article class="panel compact"><h4>Vittorie</h4><p>${profile.wins}</p></article>
        <article class="panel compact"><h4>Rank attuale</h4><p>${getRankLabel(profile.mmr)}</p></article>
      </div>
    </section>
  `;
}
