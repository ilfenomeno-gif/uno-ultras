import { COLORS } from "./constants.js";
import { shuffle } from "./utils.js";

export function buildDeck() {
  const deck = [];

  for (const col of COLORS) {
    deck.push({ col, val: "0" });

    for (let n = 1; n <= 9; n += 1) {
      deck.push({ col, val: String(n) });
      deck.push({ col, val: String(n) });
    }

    ["skip", "rev", "d2"].forEach((v) => {
      deck.push({ col, val: v });
      deck.push({ col, val: v });
    });
  }

  for (let i = 0; i < 4; i += 1) {
    deck.push({ col: "w", val: "w" });
    deck.push({ col: "w", val: "w4" });
  }

  return shuffle(deck);
}

export function refillDeckFromDiscard(state) {
  if (state.deck.length > 0) return;
  const top = state.discard.pop();
  state.deck = shuffle([...state.discard]);
  state.discard = [top];
}
