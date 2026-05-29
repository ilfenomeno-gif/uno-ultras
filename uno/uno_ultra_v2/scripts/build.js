import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const requiredPaths = [
  "index.html",
  "original.html",
  "legacy/index-runtime.html",
  "legacy/original-runtime.html",
  "data/original-reference.html",
  "css/shell.css",
  "css/styles.css",
  "js/main.js",
  "js/core/constants.js",
  "js/core/deck.js",
  "js/core/state.js",
  "js/core/game.js",
  "js/systems/ai.js",
  "js/systems/multiplayer.js",
  "js/systems/tournaments.js",
  "js/systems/progression.js",
  "js/systems/social.js",
  "js/systems/replay.js",
  "js/systems/queue.js",
  "js/systems/ucs.js",
  "js/systems/grandprix.js",
  "js/systems/pentathlon.js",
  "js/systems/minigames/scala40.js",
  "data/cards.json",
  "data/port-audit.json",
  "data/ranks.json",
  "data/playlists.json",
  "photos/card-fronts/default.svg",
  "photos/card-backs/default.svg",
  "audio/sfx/manifest.json",
  "audio/music/manifest.json",
  "scripts/port-original.js"
];

const requiredShellMarkers = [
  'id="app"',
  'css/shell.css',
  'type="module" src="./js/main.js"'
];

const requiredLegacyMarkers = [
  'id="loading"',
  'id="login"',
  'id="splash"',
  'id="nav-play"',
  'id="game"',
  'id="tournament"',
  'onclick="openMultiplayer()"',
  'id="quick-chat-bar"',
  'id="news-feed"',
  'id="club-modal-overlay"',
  'id="tournament-lobby-hud"'
];

function ensurePaths() {
  const missing = requiredPaths.filter((rel) => !existsSync(path.join(root, rel)));
  if (missing.length) {
    console.error("Missing required paths:\n" + missing.join("\n"));
    process.exit(1);
  }
}

function ensurePortMarkers() {
  const indexHtml = readFileSync(path.join(root, "index.html"), "utf8");
  const legacyHtml = readFileSync(path.join(root, "legacy", "index-runtime.html"), "utf8");
  const stylesCss = readFileSync(path.join(root, "css", "styles.css"), "utf8");
  const portAudit = JSON.parse(readFileSync(path.join(root, "data", "port-audit.json"), "utf8"));

  const missingShellMarkers = requiredShellMarkers.filter((marker) => !indexHtml.includes(marker));
  if (missingShellMarkers.length) {
    console.error("Missing required shell markers:\n" + missingShellMarkers.join("\n"));
    process.exit(1);
  }

  const missingLegacyMarkers = requiredLegacyMarkers.filter((marker) => !legacyHtml.includes(marker));
  if (missingLegacyMarkers.length) {
    console.error("Missing required legacy markers:\n" + missingLegacyMarkers.join("\n"));
    process.exit(1);
  }

  if (!stylesCss.includes("Extracted from original.html")) {
    console.error("styles.css does not look extracted from original.html");
    process.exit(1);
  }

  if (Array.isArray(portAudit.missing) && portAudit.missing.length) {
    console.error("Original audit still reports missing markers:\n" + portAudit.missing.join("\n"));
    process.exit(1);
  }
}

function copyRootEntries() {
  const entries = ["index.html", "css", "js", "data", "photos", "audio", "package.json", "README.md"];
  rmSync(dist, { recursive: true, force: true });
  mkdirSync(dist, { recursive: true });

  for (const entry of entries) {
    const src = path.join(root, entry);
    const dest = path.join(dist, entry);
    if (!existsSync(src)) continue;
    cpSync(src, dest, { recursive: true });
  }

  const manifest = scanFiles(dist).map((file) => path.relative(dist, file).replaceAll("\\", "/"));
  writeFileSync(path.join(dist, "build-manifest.json"), JSON.stringify({ generatedAt: new Date().toISOString(), files: manifest }, null, 2));
}

function scanFiles(base) {
  const out = [];
  const entries = readdirSync(base, { withFileTypes: true });
  for (const entry of entries) {
    const resolved = path.join(base, entry.name);
    if (entry.isDirectory()) {
      out.push(...scanFiles(resolved));
      continue;
    }
    if (statSync(resolved).isFile()) {
      out.push(resolved);
    }
  }
  return out;
}

ensurePaths();
ensurePortMarkers();
if (process.argv.includes("--check")) {
  console.log("Project structure check passed.");
  process.exit(0);
}
copyRootEntries();
console.log("Build completed in dist/.");
