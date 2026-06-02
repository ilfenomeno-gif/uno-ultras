function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeName(name, fallback = "Player") {
  const clean = String(name || "").trim();
  return clean || fallback;
}

function readRuntimeProfiles(frameWindow) {
  if (!frameWindow || typeof frameWindow !== "object") return [];
  let db = null;
  try {
    if (typeof frameWindow._loadDB === "function") {
      db = frameWindow._loadDB();
    }
  } catch {
    db = null;
  }
  if (!db || typeof db !== "object") return [];

  return Object.values(db).filter((p) => p && typeof p === "object");
}

function toLeaderboardEntry(profile, fallbackName, rankLabelResolver) {
  const name = normalizeName(profile?.name, fallbackName);
  const mmr = Math.max(200, safeNumber(profile?.mmr, safeNumber(profile?.mmrP1, 200)));
  const wins = safeNumber(profile?.wins, 0)
    + safeNumber(profile?.winsRanked, 0)
    + safeNumber(profile?.winsCasual, 0)
    + safeNumber(profile?.winsBlitz, 0)
    + safeNumber(profile?.winsChaos, 0);

  return {
    n: name,
    mmr,
    r: typeof rankLabelResolver === "function" ? rankLabelResolver(mmr) : "Bronze",
    wins,
  };
}

export function buildTop100FromLocal(frameWindow, shellProfile, rankLabelResolver) {
  const entries = [];
  const seen = new Set();

  const runtimeProfiles = readRuntimeProfiles(frameWindow);
  runtimeProfiles.forEach((profile, index) => {
    const entry = toLeaderboardEntry(profile, `Player${index + 1}`, rankLabelResolver);
    const key = entry.n.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    entries.push(entry);
  });

  if (shellProfile && typeof shellProfile === "object") {
    const ownEntry = toLeaderboardEntry(shellProfile, "Tu", rankLabelResolver);
    const ownKey = ownEntry.n.toLowerCase();
    if (!seen.has(ownKey)) {
      seen.add(ownKey);
      entries.push(ownEntry);
    }
  }

  entries.sort((a, b) => {
    if (b.mmr !== a.mmr) return b.mmr - a.mmr;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.n.localeCompare(b.n, "it", { sensitivity: "base" });
  });

  return entries.slice(0, 100);
}
