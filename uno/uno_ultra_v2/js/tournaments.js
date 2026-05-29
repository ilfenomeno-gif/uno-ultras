const TOURNAMENT_KEY = "uno-ultra-v2-tournament-state";

function createEntry(name, isBot = true) {
  return {
    id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    isBot,
  };
}

function buildBotName(index) {
  return `Bot Tourney ${index}`;
}

function simulateBotMatch(a, b) {
  const winner = Math.random() > 0.5 ? a : b;
  const loser = winner === a ? b : a;
  return {
    winner,
    loser,
    score: `${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 2)}`,
  };
}

function chunk(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) {
    out.push(list.slice(i, i + size));
  }
  return out;
}

function normalizeTournament(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (!Array.isArray(raw.rounds) || typeof raw.currentRound !== "number") return null;
  return {
    id: raw.id,
    createdAt: raw.createdAt,
    playerName: raw.playerName || "Player",
    mode: raw.mode || "classic8",
    currentRound: raw.currentRound,
    status: raw.status || "active",
    rounds: raw.rounds,
    champion: raw.champion || null,
  };
}

function saveTournamentState(state) {
  if (!state) {
    localStorage.removeItem(TOURNAMENT_KEY);
    return;
  }
  localStorage.setItem(TOURNAMENT_KEY, JSON.stringify(state));
}

export function loadTournamentState() {
  try {
    const raw = localStorage.getItem(TOURNAMENT_KEY);
    if (!raw) return null;
    return normalizeTournament(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function createClassicTournament(playerName, size = 8) {
  const slots = [createEntry(playerName, false)];
  for (let i = 1; i < size; i += 1) {
    slots.push(createEntry(buildBotName(i), true));
  }

  // basic shuffle for bracket variety
  for (let i = slots.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  const firstRound = chunk(slots, 2).map((pair, idx) => ({
    id: `r1-m${idx + 1}`,
    a: pair[0],
    b: pair[1],
    played: false,
    winner: null,
    loser: null,
    score: null,
  }));

  const state = {
    id: `t-${Date.now()}`,
    createdAt: Date.now(),
    playerName,
    mode: "classic8",
    currentRound: 0,
    status: "active",
    rounds: [firstRound],
    champion: null,
  };

  saveTournamentState(state);
  return state;
}

export function playRoundBots(state) {
  const safe = normalizeTournament(state);
  if (!safe || safe.status !== "active") return safe;

  const round = safe.rounds[safe.currentRound] || [];
  let humanMatch = null;

  for (const match of round) {
    if (match.played) continue;
    const hasHuman = !match.a.isBot || !match.b.isBot;
    if (hasHuman) {
      humanMatch = match;
      continue;
    }
    const sim = simulateBotMatch(match.a, match.b);
    match.played = true;
    match.winner = sim.winner;
    match.loser = sim.loser;
    match.score = sim.score;
  }

  saveTournamentState(safe);
  return {
    state: safe,
    humanMatch,
  };
}

export function resolveHumanMatch(state, winnerSide) {
  const safe = normalizeTournament(state);
  if (!safe || safe.status !== "active") return safe;

  const round = safe.rounds[safe.currentRound] || [];
  const match = round.find((m) => !m.played && (!m.a.isBot || !m.b.isBot));
  if (!match) return safe;

  const winner = winnerSide === "b" ? match.b : match.a;
  const loser = winner === match.a ? match.b : match.a;

  match.played = true;
  match.winner = winner;
  match.loser = loser;
  match.score = winner.isBot ? "0-1" : "1-0";

  const allPlayed = round.every((m) => m.played);
  if (allPlayed) {
    const winners = round.map((m) => m.winner).filter(Boolean);
    if (winners.length === 1) {
      safe.status = "completed";
      safe.champion = winners[0];
      saveTournamentState(safe);
      return safe;
    }

    const nextRoundIdx = safe.currentRound + 1;
    const nextRound = chunk(winners, 2).map((pair, idx) => ({
      id: `r${nextRoundIdx + 1}-m${idx + 1}`,
      a: pair[0],
      b: pair[1],
      played: false,
      winner: null,
      loser: null,
      score: null,
    }));

    safe.rounds.push(nextRound);
    safe.currentRound = nextRoundIdx;
  }

  saveTournamentState(safe);
  return safe;
}

export function getTournamentView(state) {
  const safe = normalizeTournament(state);
  if (!safe) {
    return {
      exists: false,
      statusText: "Nessun torneo attivo",
      rounds: [],
      champion: null,
    };
  }

  const statusText = safe.status === "completed"
    ? `Torneo concluso. Campione: ${safe.champion?.name || "-"}`
    : `Round ${safe.currentRound + 1} in corso`;

  return {
    exists: true,
    statusText,
    rounds: safe.rounds,
    champion: safe.champion,
  };
}

export function clearTournamentState() {
  saveTournamentState(null);
}
