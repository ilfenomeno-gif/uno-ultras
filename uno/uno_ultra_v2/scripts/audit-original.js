import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outPath = path.join(root, "data", "port-audit.json");

const markers = [
  { id: "loading", token: 'id="loading"', scope: "screen" },
  { id: "login", token: 'id="login"', scope: "screen" },
  { id: "splash", token: 'id="splash"', scope: "screen" },
  { id: "home", token: "id=\"nav-play\"", scope: "screen" },
  { id: "game", token: 'id="game"', scope: "screen" },
  { id: "tournament", token: 'id="tournament"', scope: "screen" },
  { id: "online", token: 'onclick="openMultiplayer()"', scope: "screen" },
  { id: "showScr", token: "function showscr", scope: "function" },
  { id: "setText", token: "function settext", scope: "function" },
  { id: "startGame", token: "function startgame", scope: "function" },
  { id: "openTournament", token: "function opentournament", scope: "function" },
  { id: "cloudLogin", token: "async function cloudlogin", scope: "function" },
  { id: "toggleMusic", token: "function togglemusic", scope: "function" },
  { id: "burst", token: "function burst(", scope: "function" },
  { id: "renderAIs", token: "renderais", scope: "function" },
  { id: "aiTurn", token: "function aiturn", scope: "function" },
  { id: "openMultiplayer", token: "function openmultiplayer", scope: "function" },
  { id: "pentathlon", token: "pentathlon", scope: "system" },
  { id: "spectator", token: "spectator", scope: "system" },
  { id: "replay", token: "replay", scope: "system" },
  { id: "quick-chat", token: "quick-chat", scope: "system" },
  { id: "friend", token: "friend", scope: "system" },
  { id: "nvda", token: "nvda", scope: "system" },
  { id: "ucs", token: "ucs", scope: "system" },
  { id: "grand-prix", token: "grand prix", scope: "system" },
  { id: "custom-game", token: "custom game", scope: "system" },
  { id: "double-elimination", token: "double elimination", scope: "system" },
  { id: "scopa", token: "scopa", scope: "minigame" },
  { id: "ruba", token: "ruba", scope: "minigame" },
  { id: "scala40", token: "scala", scope: "minigame" },
  { id: "blackjack", token: "blackjack", scope: "minigame" },
  { id: "poker", token: "poker", scope: "minigame" },
  { id: "burraco", token: "burraco", scope: "minigame" },
  { id: "millemiglia", token: "millemiglia", scope: "minigame" }
];

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      files.push(...walk(resolved));
      continue;
    }
    if (statSync(resolved).isFile()) {
      files.push(resolved);
    }
  }
  return files;
}

const originalPath = path.join(root, "data", "original-reference.html");
const original = readFileSync(originalPath, "utf8").toLowerCase();
const corpus = walk(root)
  .filter((file) => file !== originalPath)
  .filter((file) => /\.(html|css|js|json|md)$/i.test(file))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n")
  .toLowerCase();

const results = markers.map((marker) => ({
  ...marker,
  inOriginal: original.includes(marker.token),
  inPort: corpus.includes(marker.token),
}));

const missing = results.filter((marker) => marker.inOriginal && !marker.inPort).map((marker) => marker.id);
const payload = {
  generatedAt: new Date().toISOString(),
  missing,
  counts: {
    total: results.length,
    matched: results.filter((marker) => !marker.inOriginal || marker.inPort).length,
  },
  checked: results,
};

writeFileSync(outPath, JSON.stringify(payload, null, 2));
console.log(`Original audit completed. Missing markers: ${missing.length}`);
