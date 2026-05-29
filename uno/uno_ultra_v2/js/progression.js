const PROFILE_KEY = "uno-ultra-v2-profile";

const RANKS = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 400 },
  { name: "Gold", min: 800 },
  { name: "Platinum", min: 1200 },
  { name: "Diamond", min: 1600 },
  { name: "Champion", min: 2000 },
  { name: "GrandChampion", min: 2400 },
  { name: "SSL", min: 2800 },
];

function createDefaultProfile() {
  return {
    name: "Player",
    level: 1,
    xp: 0,
    credits: 0,
    games: 0,
    wins: 0,
    losses: 0,
    winStreak: 0,
    maxWinStreak: 0,
    mmrByPlaylist: {
      p1: 200,
      p3: 200,
      p4: 200,
      p1_casual: 200,
      p3_casual: 200,
      p4_casual: 200,
      p1_blitz: 200,
      p3_blitz: 200,
      p4_blitz: 200,
      p1_chaos: 200,
      p3_chaos: 200,
      p4_chaos: 200,
    },
    history: [],
    titles: [],
    selectedTitle: null,
  };
}

function xpForLevel(level) {
  return Math.floor(100 * Math.pow(1.35, level));
}

function rankFromMmr(mmr) {
  let rank = RANKS[0];
  for (const it of RANKS) {
    if (mmr >= it.min) {
      rank = it;
    } else {
      break;
    }
  }
  return rank;
}

function expectedScore(playerMmr, opponentMmr) {
  return 1 / (1 + Math.pow(10, (opponentMmr - playerMmr) / 400));
}

function getPlaylistKey(playerCount, mode = "ranked") {
  const base = playerCount <= 2 ? "p1" : playerCount === 3 ? "p3" : "p4";
  if (mode === "casual") return `${base}_casual`;
  if (mode === "blitz") return `${base}_blitz`;
  if (mode === "chaos") return `${base}_chaos`;
  return base;
}

function avgOpponentScore(scores, playerIndex) {
  const others = scores.filter((_, idx) => idx !== playerIndex);
  if (!others.length) return 0;
  return others.reduce((sum, v) => sum + v, 0) / others.length;
}

function eloDelta(playerMmr, opponentMmr, won, streak = 0) {
  const k = 32;
  const expected = expectedScore(playerMmr, opponentMmr);
  const result = won ? 1 : 0;
  let delta = Math.round(k * (result - expected));

  if (won) {
    if (streak >= 10) delta += 15;
    else if (streak >= 5) delta += 10;
    else if (streak >= 3) delta += 5;
  }

  return delta;
}

function normalizeProfile(raw) {
  const base = createDefaultProfile();
  const merged = {
    ...base,
    ...(raw || {}),
    mmrByPlaylist: {
      ...base.mmrByPlaylist,
      ...((raw && raw.mmrByPlaylist) || {}),
    },
    history: Array.isArray(raw?.history) ? raw.history.slice(-100) : [],
    titles: Array.isArray(raw?.titles) ? raw.titles : [],
  };
  return merged;
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      const created = createDefaultProfile();
      saveProfile(created);
      return created;
    }
    return normalizeProfile(JSON.parse(raw));
  } catch {
    const fallback = createDefaultProfile();
    saveProfile(fallback);
    return fallback;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(normalizeProfile(profile)));
}

export function applyMatchResult(profile, context) {
  const next = normalizeProfile(profile);
  const {
    playerCount,
    mode = "ranked",
    localPlayerIndex = 0,
    finalScores,
    didWin,
    roundCount,
  } = context;

  const playlist = getPlaylistKey(playerCount, mode);
  const currentMmr = next.mmrByPlaylist[playlist] ?? 200;
  const oppScore = avgOpponentScore(finalScores, localPlayerIndex);
  const mmrDelta = eloDelta(currentMmr, oppScore, didWin, next.winStreak);

  next.games += 1;
  if (didWin) {
    next.wins += 1;
    next.winStreak += 1;
    next.maxWinStreak = Math.max(next.maxWinStreak, next.winStreak);
    next.credits += 40;
  } else {
    next.losses += 1;
    next.winStreak = 0;
    next.credits += 10;
  }

  next.mmrByPlaylist[playlist] = Math.max(0, currentMmr + mmrDelta);

  const xpGain = 40 + Math.max(0, roundCount - 1) * 10 + (didWin ? 50 : 0);
  next.xp += xpGain;

  while (next.xp >= xpForLevel(next.level)) {
    next.xp -= xpForLevel(next.level);
    next.level += 1;
  }

  const rank = rankFromMmr(next.mmrByPlaylist[playlist]);
  next.history.unshift({
    ts: Date.now(),
    playlist,
    didWin,
    mmrDelta,
    mmr: next.mmrByPlaylist[playlist],
    rank: rank.name,
    roundCount,
    finalScores: [...finalScores],
  });
  next.history = next.history.slice(0, 100);

  saveProfile(next);
  return {
    profile: next,
    result: {
      playlist,
      mmrDelta,
      rank: rank.name,
      xpGain,
    },
  };
}

export function getProfileHud(profile, playerCount, mode = "ranked") {
  const safe = normalizeProfile(profile);
  const playlist = getPlaylistKey(playerCount, mode);
  const mmr = safe.mmrByPlaylist[playlist] ?? 200;
  const rank = rankFromMmr(mmr);
  return {
    level: safe.level,
    xp: safe.xp,
    xpNext: xpForLevel(safe.level),
    rank: rank.name,
    mmr,
    wins: safe.wins,
    games: safe.games,
    streak: safe.winStreak,
  };
}
