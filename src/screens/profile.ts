import { getRankLabel, profile } from '../core/store';

export function renderProfile(): string {
  return `
    <section class="panel">
      <h2>Profilo</h2>
      <div class="grid three">
        <article class="panel compact"><h4>Giocatore</h4><p>${profile.name}</p></article>
        <article class="panel compact"><h4>Partite</h4><p>${profile.games}</p></article>
        <article class="panel compact"><h4>Rank</h4><p>${getRankLabel(profile.mmr)} (${profile.mmr})</p></article>
      </div>
      <div class="grid two">
        <article class="panel compact"><h4>Win / Loss</h4><p>${profile.wins} / ${profile.losses}</p></article>
        <article class="panel compact"><h4>Crediti</h4><p>${profile.credits}</p></article>
      </div>
      <h4>Titoli</h4>
      <div class="chip-wrap">${profile.titles.map((t) => `<span class="chip active">${t}</span>`).join('')}</div>
    </section>
  `;
}
