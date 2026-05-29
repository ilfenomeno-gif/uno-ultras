import { DEFAULTS } from "./constants.js";
import { buildDeck, refillDeckFromDiscard } from "./deck.js";
import { canPlay, applyCardEffect, scoreHand } from "./rules.js";
import { createGameState } from "./state.js";
import { nextIndex } from "./utils.js";
import { runAiTurn } from "./ai.js";

export function createGameController(ui, options = {}) {
  let state = null;
  let localPlayerIndex = options.localPlayerIndex ?? 0;
  let authoritative = options.authoritative ?? true;

  const callbacks = {
    onStateChange: null,
    onActionRequest: null,
    onRoundEnd: null,
    onMatchEnd: null,
  };

  function cloneState(value) {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
  }

  function emitStateSync() {
    if (!authoritative || !callbacks.onStateChange || !state) return;
    callbacks.onStateChange(cloneState(state));
  }

  function drawCards(playerIndex, amount) {
    const p = state.players[playerIndex];
    for (let i = 0; i < amount; i += 1) {
      refillDeckFromDiscard(state);
      if (!state.deck.length) break;
      p.hand.push(state.deck.pop());
    }
  }

  function drawCardForCurrent(amount = 1) {
    drawCards(state.current, amount);
    state.drawnThisTurn = true;
  }

  function initRound() {
    state.deck = buildDeck();
    state.discard = [];
    state.currentColor = null;
    state.pendingDraw = 0;
    state.skipNext = false;
    state.drawnThisTurn = false;
    state.unoSaid = Array(state.players.length).fill(false);

    state.players.forEach((p) => {
      p.hand = [];
      for (let i = 0; i < state.settings.startHand; i += 1) {
        p.hand.push(state.deck.pop());
      }
    });

    let first = state.deck.pop();
    while (first?.val === "w4") {
      state.deck.unshift(first);
      first = state.deck.pop();
    }
    state.discard.push(first);
    state.currentColor = first.col === "w" ? "r" : first.col;

    if (first.val === "skip" || first.val === "rev" || first.val === "d2") {
      applyCardEffect(state, first);
    }

    state.current = 0;
    state.started = true;
    state.ended = false;
  }

  function endRound(winnerIndex) {
    const gain = state.players
      .map((p, idx) => (idx === winnerIndex ? 0 : scoreHand(p.hand)))
      .reduce((a, b) => a + b, 0);

    state.players[winnerIndex].score += gain;
    callbacks.onRoundEnd?.({
      winnerIndex,
      gain,
      round: state.round,
      scores: state.players.map((p) => p.score),
    });

    const hasWinner = state.players.some((p) => p.score >= state.targetScore);
    if (hasWinner) {
      state.ended = true;
      const champ = state.players.reduce((best, p) => (p.score > best.score ? p : best), state.players[0]);
      ui.announce(`Match over. Winner: ${champ.name}`);
      callbacks.onMatchEnd?.({
        winnerIndex: state.players.indexOf(champ),
        finalScores: state.players.map((p) => p.score),
        roundCount: state.round,
      });
      emitStateSync();
      return;
    }

    state.round += 1;
    initRound();
    tick();
  }

  function enforceUnoPenalty(playerIndex) {
    const p = state.players[playerIndex];
    if (p.hand.length === 1 && !state.unoSaid[playerIndex]) {
      drawCards(playerIndex, 2);
      ui.announce(`${p.name} penalita UNO: +2 carte`);
    }
  }

  function advanceTurn() {
    enforceUnoPenalty(state.current);

    let next = nextIndex(state.current, state.players.length, state.direction);
    if (state.skipNext) {
      next = nextIndex(next, state.players.length, state.direction);
      state.skipNext = false;
    }

    state.current = next;
    state.drawnThisTurn = false;
    tick();
  }

  function resolvePostPlay(playerIndex) {
    if (state.players[playerIndex].hand.length === 0) {
      endRound(playerIndex);
      return;
    }
    advanceTurn();
  }

  async function playCard(playerIndex, cardIndex, forcedColor = null) {
    if (state.ended) return;
    if (state.current !== playerIndex) return;

    const player = state.players[playerIndex];
    if (!player) return;
    const card = player.hand[cardIndex];
    if (!card) return;
    if (!canPlay(card, state)) return;

    player.hand.splice(cardIndex, 1);
    state.discard.push(card);

    let chosenColor = forcedColor;
    if (card.col === "w") {
      if (!chosenColor && !player.isAI) {
        chosenColor = await ui.requestColorChoice();
      }
      if (!chosenColor) {
        const counts = { r: 0, b: 0, g: 0, y: 0 };
        player.hand.forEach((c) => {
          if (counts[c.col] !== undefined) counts[c.col] += 1;
        });
        chosenColor = Object.keys(counts).reduce((a, b) => (counts[a] >= counts[b] ? a : b), "r");
      }
      state.currentColor = chosenColor;
    } else {
      state.currentColor = card.col;
    }

    applyCardEffect(state, card);
    state.unoSaid[playerIndex] = false;
    resolvePostPlay(playerIndex);
  }

  function playerDeclareUno(playerIndex = localPlayerIndex) {
    if (!state) return;
    if (!authoritative) {
      callbacks.onActionRequest?.({ type: "action_uno", playerIndex });
      return;
    }
    if (state.current !== playerIndex) return;
    state.unoSaid[playerIndex] = true;
    ui.announce("UNO dichiarato");
    render();
  }

  function playerDraw(playerIndex = localPlayerIndex) {
    if (!state || state.ended) return;
    if (!authoritative) {
      callbacks.onActionRequest?.({ type: "action_draw", playerIndex });
      return;
    }

    if (state.current !== playerIndex) return;

    if (state.pendingDraw > 0) {
      drawCardForCurrent(state.pendingDraw);
      state.pendingDraw = 0;
      advanceTurn();
      return;
    }

    if (state.drawnThisTurn) {
      advanceTurn();
      return;
    }

    drawCardForCurrent(1);
    const current = state.players[playerIndex];
    const topDrawn = current.hand[current.hand.length - 1];
    if (!topDrawn || !canPlay(topDrawn, state)) {
      advanceTurn();
      return;
    }

    render();
  }

  function sortPlayerHand(playerIndex = localPlayerIndex) {
    if (!state) return;
    const target = state.players[playerIndex];
    if (!target) return;
    const colOrder = { r: 0, b: 1, g: 2, y: 3, w: 4 };
    const valOrder = { skip: 20, rev: 21, d2: 22, w: 23, w4: 24 };
    target.hand.sort((a, b) => {
      const byCol = colOrder[a.col] - colOrder[b.col];
      if (byCol !== 0) return byCol;
      const va = Number.isNaN(Number(a.val)) ? (valOrder[a.val] || 99) : Number(a.val);
      const vb = Number.isNaN(Number(b.val)) ? (valOrder[b.val] || 99) : Number(b.val);
      return va - vb;
    });
    render();
  }

  function render() {
    ui.renderState(state, {
      canPlay,
      onPlayerCard: async (index) => {
        if (!state || state.ended || state.current !== localPlayerIndex) return;
        if (!authoritative) {
          const local = state.players[localPlayerIndex];
          const card = local?.hand[index];
          let chosenColor = null;
          if (card?.col === "w") {
            chosenColor = await ui.requestColorChoice();
          }
          callbacks.onActionRequest?.({
            type: "action_play",
            playerIndex: localPlayerIndex,
            cardIndex: index,
            color: chosenColor,
          });
          return;
        }
        await playCard(localPlayerIndex, index);
      },
    }, {
      localPlayerIndex,
      canInteract: state.current === localPlayerIndex,
    });

    emitStateSync();
  }

  async function tick() {
    render();
    if (!authoritative || state.ended) return;

    const currentPlayer = state.players[state.current];
    if (!currentPlayer.isAI) return;

    await runAiTurn({
      state,
      canPlay,
      playCard: async (cardIndex, forcedColor) => playCard(state.current, cardIndex, forcedColor),
      drawCardForCurrent,
      advanceTurn,
    });

    render();
  }

  function startNewGame(options) {
    state = createGameState({
      aiCount: options.aiCount ?? DEFAULTS.aiCount,
      diff: options.diff ?? DEFAULTS.diff,
      targetScore: options.targetScore ?? DEFAULTS.targetScore,
      playersConfig: options.playersConfig ?? null,
    });
    initRound();
    tick();
  }

  async function handleRemoteAction(action) {
    if (!authoritative || !state || state.ended || !action) return;
    if (state.current !== action.playerIndex) return;

    switch (action.type) {
      case "action_play":
        await playCard(action.playerIndex, action.cardIndex, action.color || null);
        break;
      case "action_draw":
        playerDraw(action.playerIndex);
        break;
      case "action_uno":
        playerDeclareUno(action.playerIndex);
        break;
      default:
        break;
    }
  }

  function setStateFromSync(snapshot) {
    state = cloneState(snapshot);
    render();
  }

  function setCallbacks(nextCallbacks = {}) {
    callbacks.onStateChange = nextCallbacks.onStateChange || null;
    callbacks.onActionRequest = nextCallbacks.onActionRequest || null;
    callbacks.onRoundEnd = nextCallbacks.onRoundEnd || null;
    callbacks.onMatchEnd = nextCallbacks.onMatchEnd || null;
  }

  function setAuthoritative(value) {
    authoritative = !!value;
  }

  function setLocalPlayerIndex(index) {
    localPlayerIndex = index;
  }

  return {
    startNewGame,
    playerDeclareUno,
    playerDraw,
    sortPlayerHand,
    handleRemoteAction,
    setStateFromSync,
    setCallbacks,
    setAuthoritative,
    setLocalPlayerIndex,
    render,
    exitToMenu: () => {
      state = null;
    },
    getLocalPlayerIndex: () => localPlayerIndex,
    isAuthoritative: () => authoritative,
    getState: () => state,
  };
}
