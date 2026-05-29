import { DIFF_DELAY_MS } from "./constants.js";
import { chooseBestColorFromHand } from "./rules.js";
import { delay } from "./utils.js";

function diffDelay(diff) {
  const [min, max] = DIFF_DELAY_MS[diff] || DIFF_DELAY_MS.normal;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function runAiTurn(ctx) {
  const { state, canPlay, playCard, drawCardForCurrent, advanceTurn } = ctx;
  const player = state.players[state.current];
  if (!player?.isAI || state.ended) return;

  await delay(diffDelay(state.diff));

  if (state.pendingDraw > 0) {
    const stackIndex = player.hand.findIndex((c) => c.val === "d2" || c.val === "w4");
    if (stackIndex >= 0) {
      const card = player.hand[stackIndex];
      const chosenColor = card.col === "w" ? chooseBestColorFromHand(player.hand) : null;
      playCard(stackIndex, chosenColor);
      return;
    }

    drawCardForCurrent(state.pendingDraw);
    state.pendingDraw = 0;
    advanceTurn();
    return;
  }

  const playable = player.hand
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => canPlay(card, state));

  if (playable.length === 0) {
    drawCardForCurrent(1);
    const topDrawnIndex = player.hand.length - 1;
    const drawnCard = player.hand[topDrawnIndex];
    if (drawnCard && canPlay(drawnCard, state)) {
      const chosenColor = drawnCard.col === "w" ? chooseBestColorFromHand(player.hand) : null;
      playCard(topDrawnIndex, chosenColor);
      return;
    }
    advanceTurn();
    return;
  }

  playable.sort((a, b) => {
    const rank = (card) => {
      if (card.val === "w4") return 100;
      if (card.val === "d2") return 90;
      if (card.val === "skip") return 80;
      if (card.val === "rev") return 70;
      if (card.val === "w") return 60;
      return Number(card.val) || 10;
    };
    return rank(b.card) - rank(a.card);
  });

  const pick = playable[0];
  const chosenColor = pick.card.col === "w" ? chooseBestColorFromHand(player.hand) : null;
  playCard(pick.index, chosenColor);
}
