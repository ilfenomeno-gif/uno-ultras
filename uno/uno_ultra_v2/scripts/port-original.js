import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const originalPath = path.join(root, "data", "original-reference.html");
const indexPath = path.join(root, "index.html");
const stylesPath = path.join(root, "css", "styles.css");
const cardsPath = path.join(root, "data", "cards.json");
const ranksPath = path.join(root, "data", "ranks.json");
const playlistsPath = path.join(root, "data", "playlists.json");
const mainPath = path.join(root, "js", "main.js");
const readmePath = path.join(root, "README.md");

const extractedCards = {
  deck: {
    type: "uno-standard-108",
    colors: ["r", "b", "g", "y"],
    wildColor: "w",
    numeric: {
      "0": 1,
      "1": 2,
      "2": 2,
      "3": 2,
      "4": 2,
      "5": 2,
      "6": 2,
      "7": 2,
      "8": 2,
      "9": 2,
    },
    actions: {
      skip: 2,
      rev: 2,
      d2: 2,
    },
    wild: {
      wild: 4,
      w4: 4,
    },
    points: {
      skip: 20,
      rev: 20,
      d2: 20,
      wild: 50,
      w4: 50,
    },
  },
  settings: {
    startHand: 7,
    turnSeconds: 15,
    blitzSeconds: 120,
    overloadLimit: 30,
    stackingCap: 20,
    unoCoyoteMs: 1200,
  },
};

const extractedRanks = {
  xpFormula: {
    base: 100,
    exponent: 1.35,
  },
  ranks: [
    { name: "Bronze I", icon: "🥉", min: 0, color: "#CD7F32", next: 133 },
    { name: "Bronze II", icon: "🥉", min: 133, color: "#CD7F32", next: 266 },
    { name: "Bronze III", icon: "🥉", min: 266, color: "#CD7F32", next: 400 },
    { name: "Silver I", icon: "🥈", min: 400, color: "#C0C0C0", next: 466 },
    { name: "Silver II", icon: "🥈", min: 466, color: "#C0C0C0", next: 533 },
    { name: "Silver III", icon: "🥈", min: 533, color: "#C0C0C0", next: 600 },
    { name: "Gold I", icon: "🥇", min: 600, color: "#D39940", next: 666 },
    { name: "Gold II", icon: "🥇", min: 666, color: "#D39940", next: 733 },
    { name: "Gold III", icon: "🥇", min: 733, color: "#D39940", next: 800 },
    { name: "Platinum I", icon: "💠", min: 800, color: "#D2E4E3", next: 866 },
    { name: "Platinum II", icon: "💠", min: 866, color: "#D2E4E3", next: 933 },
    { name: "Platinum III", icon: "💠", min: 933, color: "#D2E4E3", next: 1000 },
    { name: "Diamond I", icon: "💎", min: 1000, color: "#7EE4F8", next: 1066 },
    { name: "Diamond II", icon: "💎", min: 1066, color: "#7EE4F8", next: 1133 },
    { name: "Diamond III", icon: "💎", min: 1133, color: "#7EE4F8", next: 1200 },
    { name: "Champion I", icon: "🏅", min: 1200, color: "#4A9CE1", next: 1266 },
    { name: "Champion II", icon: "🏅", min: 1266, color: "#4A9CE1", next: 1333 },
    { name: "Champion III", icon: "🏅", min: 1333, color: "#4A9CE1", next: 1400 },
    { name: "Grand Champion I", icon: "🔥", min: 1400, color: "#FF4081", next: 1466 },
    { name: "Grand Champion II", icon: "🔥", min: 1466, color: "#FF4081", next: 1533 },
    { name: "Grand Champion III", icon: "🔥", min: 1533, color: "#FF4081", next: 1600 },
    { name: "Supersonic Legend", icon: "⚡", min: 1600, color: "#FFFFFF", next: 99999 },
  ],
};

const extractedPlaylists = {
  playlists: [
    { key: "p1", category: "uno", mode: "ranked", players: 2, defaultMmr: 200 },
    { key: "p3", category: "uno", mode: "ranked", players: 3, defaultMmr: 200 },
    { key: "p4", category: "uno", mode: "ranked", players: 4, defaultMmr: 200 },
    { key: "p1_casual", category: "uno", mode: "casual", players: 2, defaultMmr: 200 },
    { key: "p3_casual", category: "uno", mode: "casual", players: 3, defaultMmr: 200 },
    { key: "p4_casual", category: "uno", mode: "casual", players: 4, defaultMmr: 200 },
    { key: "p1_blitz", category: "uno", mode: "blitz", players: 2, defaultMmr: 200 },
    { key: "p3_blitz", category: "uno", mode: "blitz", players: 3, defaultMmr: 200 },
    { key: "p4_blitz", category: "uno", mode: "blitz", players: 4, defaultMmr: 200 },
    { key: "p1_chaos", category: "uno", mode: "chaos", players: 2, defaultMmr: 200 },
    { key: "p3_chaos", category: "uno", mode: "chaos", players: 3, defaultMmr: 200 },
    { key: "p4_chaos", category: "uno", mode: "chaos", players: 4, defaultMmr: 200 },
    { key: "p_2v2", category: "uno", mode: "ranked", players: 4, teams: 2, defaultMmr: 200 },
    { key: "p_3v3", category: "uno", mode: "ranked", players: 6, teams: 2, defaultMmr: 200 },
    { key: "p_2v2_casual", category: "uno", mode: "casual", players: 4, teams: 2, defaultMmr: 200 },
    { key: "p_3v3_casual", category: "uno", mode: "casual", players: 6, teams: 2, defaultMmr: 200 },
    { key: "p_ruba", category: "minigame", game: "ruba", players: 2, defaultMmr: 200 },
    { key: "p_ruba_1", category: "minigame", game: "ruba", players: 2, variant: "solo", defaultMmr: 200 },
    { key: "p_ruba_3", category: "minigame", game: "ruba", players: 3, defaultMmr: 200 },
    { key: "p_ruba_4", category: "minigame", game: "ruba", players: 4, defaultMmr: 200 },
    { key: "p_scala", category: "minigame", game: "scala40", players: 2, defaultMmr: 200 },
    { key: "p_scala_1", category: "minigame", game: "scala40", players: 2, variant: "solo", defaultMmr: 200 },
    { key: "p_scala_3", category: "minigame", game: "scala40", players: 3, defaultMmr: 200 },
    { key: "p_scala_4", category: "minigame", game: "scala40", players: 4, defaultMmr: 200 },
    { key: "p_bj1", category: "minigame", game: "blackjack", players: 2, defaultMmr: 200 },
    { key: "p_bj2", category: "minigame", game: "blackjack", players: 3, defaultMmr: 200 },
    { key: "p_bj3", category: "minigame", game: "blackjack", players: 4, defaultMmr: 200 },
    { key: "p_poker", category: "minigame", game: "poker", players: 2, defaultMmr: 200 },
    { key: "p_poker_3", category: "minigame", game: "poker", players: 3, defaultMmr: 200 },
    { key: "p_poker_4", category: "minigame", game: "poker", players: 4, defaultMmr: 200 },
    { key: "p_scopa", category: "minigame", game: "scopa", players: 2, defaultMmr: 200 },
    { key: "p_scopa_3", category: "minigame", game: "scopa", players: 3, defaultMmr: 200 },
    { key: "p_scopa_4", category: "minigame", game: "scopa", players: 4, defaultMmr: 200 },
    { key: "p_burraco", category: "minigame", game: "burraco", players: 2, defaultMmr: 200 },
    { key: "p_burraco_3", category: "minigame", game: "burraco", players: 3, defaultMmr: 200 },
    { key: "p_burraco_4", category: "minigame", game: "burraco", players: 4, defaultMmr: 200 },
    { key: "p_mille", category: "minigame", game: "millemiglia", players: 2, defaultMmr: 200 },
    { key: "p_mille_3", category: "minigame", game: "millemiglia", players: 3, defaultMmr: 200 },
    { key: "p_mille_4", category: "minigame", game: "millemiglia", players: 4, defaultMmr: 200 },
  ],
};

const original = readFileSync(originalPath, "utf8");
const bodyMatch = original.match(/<body[^>]*>([\s\S]*?)<\/body>\s*<\/html>/i);
if (!bodyMatch) {
  throw new Error("Unable to locate <body> in original.html");
}

const title = original.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "UNO Ultra v52";
const viewport = original.match(/<meta name="viewport"[^>]*>/i)?.[0] || '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
const charset = original.match(/<meta charset="[^"]+"\s*\/?>/i)?.[0] || '<meta charset="UTF-8">';
const fontLinks = [...original.matchAll(/<link[^>]+fonts.googleapis.com[^>]*>/gi)].map((match) => match[0]);
const peerTag = original.match(/<script src="https:\/\/unpkg.com\/peerjs@1\.5\.4\/dist\/peerjs\.min\.js"[\s\S]*?<\/script>/i)?.[0] || "";

const styleBlocks = [...original.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1].trim());
let bodyHtml = bodyMatch[1];

const looseCssLines = [];
const keptLines = [];
let inScript = false;
let inStyle = false;

for (const line of bodyHtml.split(/\r?\n/)) {
  const trimmed = line.trim();

  if (!inScript && /<style\b/i.test(trimmed)) {
    inStyle = true;
  }

  if (!inScript && inStyle) {
    if (/<\/style>/i.test(trimmed)) {
      inStyle = false;
    }
    continue;
  }

  if (!inScript && /<script\b/i.test(trimmed)) {
    inScript = true;
    keptLines.push(line);
    if (/<\/script>/i.test(trimmed)) {
      inScript = false;
    }
    continue;
  }

  if (inScript) {
    keptLines.push(line);
    if (/<\/script>/i.test(trimmed)) {
      inScript = false;
    }
    continue;
  }

  const looksLikeCss = trimmed
    && !trimmed.startsWith("<")
    && (
      trimmed.startsWith("/*")
      || trimmed.startsWith("*/")
      || /^[.#@:]/.test(trimmed)
      || /^[a-zA-Z-]+\s*:/.test(trimmed)
      || trimmed.includes("{")
      || trimmed.includes("}")
      || trimmed.startsWith("@keyframes")
    );

  if (looksLikeCss) {
    looseCssLines.push(line);
    continue;
  }

  keptLines.push(line);
}

bodyHtml = keptLines.join("\n")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

const cssOutput = [
  "/* Extracted from original.html */",
  ...styleBlocks,
  looseCssLines.length ? "/* Recovered body-level CSS blocks from original.html */\n" + looseCssLines.join("\n") : "",
].filter(Boolean).join("\n\n") + "\n";

const mainOutput = [
  "import { installUtilityBridge } from \"./utils.js\";",
  "import * as ui from \"./ui.js\";",
  "import * as coreConstants from \"./core/constants.js\";",
  "import * as systemsMultiplayer from \"./systems/multiplayer.js\";",
  "",
  "const utils = installUtilityBridge();",
  "",
  "window.__UNO_ULTRA_PORT = {",
  "  source: \"original.html\",",
  "  mode: \"inline-runtime-extract\",",
  "  bridge: \"esm-overlay\",",
  "};",
  "",
  "window.UnoUltraModules = window.UnoUltraModules || {};",
  "window.UnoUltraModules.ui = ui;",
  "window.UnoUltraModules.core = {",
  "  constants: coreConstants,",
  "};",
  "window.UnoUltraModules.systems = {",
  "  ...(window.UnoUltraModules.systems || {}),",
  "  multiplayer: systemsMultiplayer,",
  "};",
  "window.UnoUltraModules.bootstrap = {",
  "  utils,",
  "  initializedAt: new Date().toISOString(),",
  "};",
  "",
  "document.documentElement.dataset.unoUltraBridge = \"esm-overlay\";",
].join("\n") + "\n";

const indexOutput = `<!DOCTYPE html>
<html lang="it">
<head>
${charset}
${viewport}
<title>${title}</title>
${fontLinks.join("\n")}
${peerTag}
<link rel="stylesheet" href="./css/styles.css">
</head>
<body>
${bodyHtml}
<script type="module" src="./js/main.js"></script>
</body>
</html>
`;

writeFileSync(stylesPath, cssOutput);
writeFileSync(cardsPath, JSON.stringify(extractedCards, null, 2) + "\n");
writeFileSync(ranksPath, JSON.stringify(extractedRanks, null, 2) + "\n");
writeFileSync(playlistsPath, JSON.stringify(extractedPlaylists, null, 2) + "\n");
writeFileSync(mainPath, mainOutput);
writeFileSync(indexPath, indexOutput);

const readme = readFileSync(readmePath, "utf8");
if (!readme.includes("port:original")) {
  const updated = readme + "\n\n## Porting ad alta fedelta\n\n- `node scripts/port-original.js`: estrae markup, CSS e JavaScript dal monolite `original.html` verso `index.html`, `css/styles.css` e `js/main.js`.\n";
  writeFileSync(readmePath, updated);
}

console.log("Original monolith extracted into index.html with inline runtime, plus external css/styles.css and metadata js/main.js");
