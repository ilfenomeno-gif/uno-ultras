import { getRankLabel, profile } from '../core/store';

export function renderProfile(): string {
  const winrate = profile.games > 0 ? Math.round((profile.wins / profile.games) * 100) : 0;
  const activeTitle = profile.activeTitle || profile.titles[profile.activeTitleIndex] || profile.titles[0] || 'Nessun titolo';

  return `
    <section class="panel">
      <h2>Profilo</h2>
      <div class="setting-row">
        <label for="profile-name">Nome Giocatore</label>
        <input type="text" id="profile-name" value="${profile.name}" maxlength="20" aria-label="Nome del giocatore" data-profile-field="name" />
      </div>
      <div class="grid three">
        <article class="panel compact"><h4>Titolo attivo</h4><p>${activeTitle}</p></article>
        <article class="panel compact"><h4>Partite</h4><p>${profile.games}</p></article>
        <article class="panel compact"><h4>Rank</h4><p>${getRankLabel(profile.mmr)} (${profile.mmr})</p></article>
      </div>
      <div class="grid two">
        <article class="panel compact"><h4>Win / Loss</h4><p>${profile.wins} / ${profile.losses}</p></article>
        <article class="panel compact"><h4>Crediti</h4><p>${profile.credits}</p></article>
      </div>
      <p>Winrate: ${winrate}%</p>
      <h4>Titoli</h4>
      <div class="chip-wrap">${profile.titles
        .map(
          (title) =>
            `<button class="chip ${title === activeTitle ? 'active' : ''}" data-action="select-title" data-title="${title}" aria-pressed="${title === activeTitle ? 'true' : 'false'}" type="button">${title}</button>`
        )
        .join('')}</div>
    </section>
  `;
}
