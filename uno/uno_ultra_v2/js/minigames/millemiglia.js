import { createSeededRng, pickWeighted, clamp } from "./shared.js";

function drawDistance(rng) {
  return pickWeighted(rng, [
    { value: 25, weight: 10 },
    { value: 50, weight: 9 },
    { value: 75, weight: 7 },
    { value: 100, weight: 5 },
    { value: 200, weight: 2 },
  ]);
}

function applyHazard(rng, km, diff) {
  const hazardChance = diff === "hard" || diff === "ultra" ? 0.32 : 0.24;
  if (rng() > hazardChance) return { km, event: null };

  const penalty = pickWeighted(rng, [
    { value: 25, weight: 8 },
    { value: 50, weight: 5 },
    { value: 75, weight: 2 },
  ]);

  return {
    km: clamp(km - penalty, 0, 1000),
    event: `Hazard -${penalty}km`,
  };
}

export function runMilleMigliaMatch({ difficulty = "normal", laps = 8 } = {}) {
  const rng = createSeededRng(Date.now() + 137);
  let playerKm = 0;
  let botKm = 0;
  const log = [];

  for (let i = 1; i <= laps; i += 1) {
    playerKm = clamp(playerKm + drawDistance(rng), 0, 1000);
    botKm = clamp(botKm + drawDistance(rng), 0, 1000);

    const pHz = applyHazard(rng, playerKm, "normal");
    const bHz = applyHazard(rng, botKm, difficulty);
    playerKm = pHz.km;
    botKm = bHz.km;

    const pEvent = pHz.event ? ` (${pHz.event})` : "";
    const bEvent = bHz.event ? ` (${bHz.event})` : "";
    log.push(`Lap ${i}: Player ${playerKm}km${pEvent} / Bot ${botKm}km${bEvent}`);

    if (playerKm >= 1000 || botKm >= 1000) {
      break;
    }
  }

  const didWin = playerKm >= botKm;
  return {
    game: "millemiglia",
    didWin,
    finalScores: [playerKm, botKm],
    rounds: laps,
    log,
  };
}
