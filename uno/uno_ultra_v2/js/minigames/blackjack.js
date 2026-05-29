import { createSeededRng } from "./shared.js";

function drawCard(rng) {
  const v = 1 + Math.floor(rng() * 13);
  if (v > 10) return 10;
  return v;
}

function handValue(cards) {
  let sum = cards.reduce((a, b) => a + b, 0);
  let aces = cards.filter((v) => v === 1).length;
  while (aces > 0 && sum + 10 <= 21) {
    sum += 10;
    aces -= 1;
  }
  return sum;
}

export function runBlackJackMatch({ rounds = 5 } = {}) {
  const rng = createSeededRng(Date.now() + 307);
  let playerWins = 0;
  let dealerWins = 0;
  const log = [];

  for (let r = 1; r <= rounds; r += 1) {
    const player = [drawCard(rng), drawCard(rng)];
    const dealer = [drawCard(rng), drawCard(rng)];

    while (handValue(player) < 17) player.push(drawCard(rng));
    while (handValue(dealer) < 17) dealer.push(drawCard(rng));

    const p = handValue(player);
    const d = handValue(dealer);

    const playerBust = p > 21;
    const dealerBust = d > 21;

    if ((!playerBust && dealerBust) || (!playerBust && p >= d)) {
      playerWins += 1;
      log.push(`Hand ${r}: Player ${p} beats Dealer ${d}`);
    } else {
      dealerWins += 1;
      log.push(`Hand ${r}: Dealer ${d} beats Player ${p}`);
    }
  }

  return {
    game: "blackjack",
    didWin: playerWins >= dealerWins,
    finalScores: [playerWins, dealerWins],
    rounds,
    log,
  };
}
