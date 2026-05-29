import { CARD_POINTS, COLORS, DEFAULTS } from "./constants.js";

export function canPlay(card, state) {
  const top = state.discard[state.discard.length - 1];
  const activeColor = state.currentColor || top.col;

  if (state.pendingDraw > 0) {
    return card.val === "d2" || card.val === "w4";
  }

  if (card.col === "w") return true;
  return card.col === activeColor || card.val === top.val;
}

export function scoreHand(hand) {
  return hand.reduce((acc, card) => {
    if (/^\d$/.test(card.val)) return acc + Number(card.val);
    return acc + (CARD_POINTS[card.val] || 0);
  }, 0);
}

export function chooseBestColorFromHand(hand) {
  const counter = { r: 0, b: 0, g: 0, y: 0 };
  hand.forEach((card) => {
    if (COLORS.includes(card.col)) counter[card.col] += 1;
  });
  return COLORS.reduce((best, col) => (counter[col] > counter[best] ? col : best), "r");
}

export function applyCardEffect(state, card) {
  if (card.val === "rev") {
    state.direction *= -1;
    if (state.players.length === 2) {
      state.skipNext = true;
    }
  }

  if (card.val === "skip") {
    state.skipNext = true;
  }

  if (card.val === "d2") {
    state.pendingDraw = Math.min(state.pendingDraw + 2, DEFAULTS.stackCap);
  }

  if (card.val === "w4") {
    state.pendingDraw = Math.min(state.pendingDraw + 4, DEFAULTS.stackCap);
  }
}
