import { createSeededRng, pickWeighted } from "./shared.js";

function simulateRound(rng, difficulty) {
  const playerBase = pickWeighted(rng, [
    { value: 18, weight: 10 },
    { value: 21, weight: 8 },
    { value: 24, weight: 7 },
    { value: 27, weight: 5 },
  ]);

  const botBias = difficulty === "hard" || difficulty === "ultra" ? 3 : 1;
  const botBase = pickWeighted(rng, [
    { value: 17 + botBias, weight: 10 },
    { value: 20 + botBias, weight: 8 },
    { value: 23 + botBias, weight: 7 },
    { value: 26 + botBias, weight: 5 },
  ]);

  return {
    playerPoints: playerBase,
    botPoints: botBase,
    playerScope: Math.floor(rng() * 4),
    botScope: Math.floor(rng() * 4),
  };
}

export function runScopaMatch({ difficulty = "normal", rounds = 3 } = {}) {
  const rng = createSeededRng(Date.now());
  let player = 0;
  let bot = 0;
  const log = [];

  for (let i = 1; i <= rounds; i += 1) {
    const r = simulateRound(rng, difficulty);
    player += r.playerPoints + r.playerScope;
    bot += r.botPoints + r.botScope;
    log.push(`Round ${i}: Player ${r.playerPoints}+${r.playerScope} / Bot ${r.botPoints}+${r.botScope}`);
  }

  const didWin = player >= bot;
  return {
    game: "scopa",
    didWin,
    finalScores: [player, bot],
    rounds,
    log,
  };
}
