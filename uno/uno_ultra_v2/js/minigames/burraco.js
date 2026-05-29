import { createSeededRng, pickWeighted } from "./shared.js";

function simulateMeld(rng, difficulty) {
  const cleanWeight = difficulty === "hard" || difficulty === "ultra" ? 7 : 5;
  const type = pickWeighted(rng, [
    { value: "clean", weight: cleanWeight },
    { value: "dirty", weight: 9 },
    { value: "short", weight: 12 },
  ]);

  if (type === "clean") return 200;
  if (type === "dirty") return 150;
  return 80;
}

export function runBurracoMatch({ difficulty = "normal", turns = 6 } = {}) {
  const rng = createSeededRng(Date.now() + 91);
  let player = 0;
  let bot = 0;
  const log = [];

  for (let t = 1; t <= turns; t += 1) {
    const playerGain = simulateMeld(rng, "normal") + Math.floor(rng() * 50);
    const botGain = simulateMeld(rng, difficulty) + Math.floor(rng() * 60);
    player += playerGain;
    bot += botGain;
    log.push(`Turn ${t}: Player +${playerGain} / Bot +${botGain}`);
  }

  const didWin = player >= bot;
  return {
    game: "burraco",
    didWin,
    finalScores: [player, bot],
    rounds: turns,
    log,
  };
}
