import { createSeededRng } from "./shared.js";

function simHand(rng, diff) {
  const base = 35 + Math.floor(rng() * 45);
  const bonus = diff === "hard" || diff === "ultra" ? 8 : 3;
  const canasta = rng() > 0.65 ? 20 : 0;
  return base + bonus + canasta;
}

export function runScalaMatch({ difficulty = "normal", rounds = 4 } = {}) {
  const rng = createSeededRng(Date.now() + 263);
  let player = 0;
  let bot = 0;
  const log = [];

  for (let i = 1; i <= rounds; i += 1) {
    const p = simHand(rng, "normal");
    const b = simHand(rng, difficulty);
    player += p;
    bot += b;
    log.push(`Round ${i}: Meld score Player ${p} / Bot ${b}`);
  }

  return {
    game: "scala",
    didWin: player >= bot,
    finalScores: [player, bot],
    rounds,
    log,
  };
}
