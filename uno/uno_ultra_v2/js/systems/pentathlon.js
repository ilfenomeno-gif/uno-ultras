import { runMiniGame } from "./minigames/registry.js";

const DEFAULT_ROTATION = ["scopa", "ruba", "scala", "blackjack", "poker"];

export async function runPentathlon(options = {}) {
  const rotation = Array.isArray(options.rotation) && options.rotation.length
    ? options.rotation
    : DEFAULT_ROTATION;

  const results = [];
  let credits = 0;
  for (const gameId of rotation) {
    const result = await Promise.resolve(runMiniGame(gameId, options.runnerOptions || {}));
    results.push(result);
    if (result.didWin) credits += 25;
  }

  const wins = results.filter((result) => result.didWin).length;
  return {
    mode: "pentathlon",
    wins,
    losses: results.length - wins,
    credits,
    didWin: wins >= Math.ceil(results.length / 2),
    results,
  };
}
