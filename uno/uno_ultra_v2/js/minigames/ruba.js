import { createSeededRng, pickWeighted } from "./shared.js";

export function runRubaMatch({ difficulty = "normal", turns = 7 } = {}) {
  const rng = createSeededRng(Date.now() + 211);
  let player = 0;
  let bot = 0;
  const log = [];

  const bias = difficulty === "hard" || difficulty === "ultra" ? 1 : 0;

  for (let t = 1; t <= turns; t += 1) {
    const pTake = pickWeighted(rng, [
      { value: 0, weight: 7 },
      { value: 1, weight: 10 },
      { value: 2, weight: 8 },
      { value: 3, weight: 4 },
    ]);
    const bTake = pickWeighted(rng, [
      { value: 0, weight: 7 - bias },
      { value: 1, weight: 10 },
      { value: 2, weight: 8 + bias },
      { value: 3, weight: 4 + bias },
    ]);

    player += pTake;
    bot += bTake;
    log.push(`Turn ${t}: Capture Player ${pTake} / Bot ${bTake}`);
  }

  return {
    game: "ruba",
    didWin: player >= bot,
    finalScores: [player, bot],
    rounds: turns,
    log,
  };
}
