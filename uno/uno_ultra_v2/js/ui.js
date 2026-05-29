import { cardLabel } from "./utils.js";

const refs = {
  screenHome: document.getElementById("screen-home"),
  screenGame: document.getElementById("screen-game"),
  hudRound: document.getElementById("hud-round"),
  hudTurn: document.getElementById("hud-turn"),
  hudDirection: document.getElementById("hud-direction"),
  hudPending: document.getElementById("hud-pending"),
  drawCount: document.getElementById("draw-count"),
  discardCard: document.getElementById("discard-card"),
  opponents: document.getElementById("opponents"),
  playerHand: document.getElementById("player-hand"),
  scoreboard: document.getElementById("scoreboard"),
  colorDialog: document.getElementById("color-dialog"),
};

function cardClass(card) {
  return `card card-${card.col}`;
}

export function showScreen(name) {
  refs.screenHome.classList.toggle("active", name === "home");
  refs.screenGame.classList.toggle("active", name === "game");
}

export function renderState(state, handlers, options = {}) {
  const localPlayerIndex = options.localPlayerIndex ?? 0;
  const canInteract = options.canInteract ?? true;
  const currentPlayer = state.players[state.current];
  refs.hudRound.textContent = String(state.round);
  refs.hudTurn.textContent = currentPlayer?.name || "-";
  refs.hudDirection.textContent = state.direction === 1 ? "Clockwise" : "Counter";
  refs.hudPending.textContent = String(state.pendingDraw);
  refs.drawCount.textContent = String(state.deck.length);

  const top = state.discard[state.discard.length - 1];
  refs.discardCard.textContent = cardLabel(top);

  refs.opponents.innerHTML = state.players
    .map((p, idx) => {
      if (idx === localPlayerIndex) return "";
      return `
      <div class="opp ${idx === state.current ? "active" : ""}">
        <div><strong>${p.name}</strong></div>
        <div>Cards: ${p.hand.length}</div>
        <div>UNO: ${state.unoSaid[idx] ? "Yes" : "No"}</div>
      </div>`;
    })
    .join("");

  const localPlayer = state.players[localPlayerIndex];
  const localTurn = state.current === localPlayerIndex;
  refs.playerHand.innerHTML = localPlayer.hand
    .map((card, index) => {
      const playable = handlers.canPlay(card, state) && localTurn && canInteract;
      return `<button data-card-index="${index}" class="${cardClass(card)} ${playable ? "" : "unplayable"}" title="${cardLabel(card)}" ${playable ? "" : "disabled"}>${cardLabel(card)}</button>`;
    })
    .join("");

  refs.playerHand.querySelectorAll("[data-card-index]").forEach((node) => {
    node.addEventListener("click", async () => {
      handlers.onPlayerCard(Number(node.getAttribute("data-card-index")));
    });
  });

  refs.scoreboard.innerHTML = state.players
    .map((p, idx) => `<div class="score-row"><span>${idx === localPlayerIndex ? "You" : p.name}</span><strong>${p.score}</strong></div>`)
    .join("");
}

export async function requestColorChoice() {
  const dialog = refs.colorDialog;
  if (!dialog) return "r";

  return new Promise((resolve) => {
    dialog.addEventListener(
      "close",
      () => {
        resolve(dialog.returnValue || "r");
      },
      { once: true },
    );
    dialog.showModal();
  });
}

export function announce(message) {
  // Lightweight status channel for now.
  console.log(`[UNO v2] ${message}`);
}
