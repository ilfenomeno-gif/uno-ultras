import { createSeededRng, pickWeighted } from "./shared.js";

const HANDS = [
  { rank: "High Card", score: 1, weight: 24 },
  { rank: "Pair", score: 2, weight: 28 },
  { rank: "Two Pair", score: 3, weight: 20 },
  { rank: "Three of a Kind", score: 4, weight: 12 },
  { rank: "Straight", score: 5, weight: 8 },
  { rank: "Flush", score: 6, weight: 6 },
  { rank: "Full House", score: 7, weight: 4 },
  { rank: "Four of a Kind", score: 8, weight: 2 },
  { rank: "Straight Flush", score: 9, weight: 1 },
];

function dealHand(rng, diff) {
  const hand = pickWeighted(rng, HANDS.map((h) => ({ ...h, weight: h.weight + (diff === "hard" || diff === "ultra" ? 1 : 0) })));
  return hand;
}

export function runPokerMatch({ difficulty = "normal", rounds = 5 } = {}) {
  const rng = createSeededRng(Date.now() + 17);
  let playerChips = 1200;
  let botChips = 1200;
  const log = [];

  for (let i = 1; i <= rounds; i += 1) {
    const ante = 50;
    const pot = ante * 2;
    playerChips -= ante;
    botChips -= ante;

    const playerHand = dealHand(rng, "normal");
    const botHand = dealHand(rng, difficulty);

    if (playerHand.score >= botHand.score) {
      playerChips += pot;
      log.push(`Hand ${i}: Player ${playerHand.rank} beats ${botHand.rank} (+${pot - ante})`);
    } else {
      botChips += pot;
      log.push(`Hand ${i}: Bot ${botHand.rank} beats ${playerHand.rank}`);
    }
  }

  const didWin = playerChips >= botChips;
  return {
    game: "poker",
    didWin,
    finalScores: [playerChips, botChips],
    rounds,
    log,
  };
}
