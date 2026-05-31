import { PROFILE_KEY, getRankLabel, profile } from '../core/store';

type LocalProfileSnapshot = {
  name?: string;
  mmr?: number;
};

function readLocalProfiles(): LocalProfileSnapshot[] {
  const snapshots: LocalProfileSnapshot[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key || key !== PROFILE_KEY) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      snapshots.push(JSON.parse(raw) as LocalProfileSnapshot);
    } catch {
      // Ignore malformed profile payloads in storage.
    }
  }
  return snapshots;
}

export function renderLeaderboard(): string {
  const snapshots = readLocalProfiles();
  const fallbackName = snapshots[0]?.name || profile.name;
  const fallbackMmr = Number.isFinite(snapshots[0]?.mmr) ? Number(snapshots[0]?.mmr) : profile.mmr;

  return `
    <section class="panel">
      <h2>Classifica Locale</h2>
      <table class="board" aria-label="Classifica demo locale">
        <thead><tr><th>Pos</th><th>Nome</th><th>Rank</th><th>MMR</th></tr></thead>
        <tbody><tr><td>#1</td><td>${fallbackName}</td><td>${getRankLabel(fallbackMmr)}</td><td>${fallbackMmr}</td></tr></tbody>
      </table>
      <p>Classifica online non disponibile in modalita locale.</p>
    </section>
  `;
}
