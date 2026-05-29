import { runScopaMatch } from "./scopa.js";
import { runPokerMatch } from "./poker.js";
import { runBurracoMatch } from "./burraco.js";
import { runMilleMigliaMatch } from "./millemiglia.js";
import { runRubaMatch } from "./ruba.js";
import { runScalaMatch } from "./scala.js";
import { runBlackJackMatch } from "./blackjack.js";

const RUNNERS = {
  scopa: runScopaMatch,
  ruba: runRubaMatch,
  scala: runScalaMatch,
  blackjack: runBlackJackMatch,
  poker: runPokerMatch,
  burraco: runBurracoMatch,
  millemiglia: runMilleMigliaMatch,
};

export const MINIGAME_LIST = [
  { id: "scopa", label: "Scopa" },
  { id: "ruba", label: "Ruba Mazzetto" },
  { id: "scala", label: "Scala 40" },
  { id: "blackjack", label: "BlackJack" },
  { id: "poker", label: "Poker" },
  { id: "burraco", label: "Burraco" },
  { id: "millemiglia", label: "Millemiglia" },
];

export function runMiniGame(id, options) {
  const runner = RUNNERS[id];
  if (!runner) {
    throw new Error(`Unknown mini-game: ${id}`);
  }
  return runner(options);
}
