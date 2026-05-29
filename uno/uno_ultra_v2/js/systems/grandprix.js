const DIVISIONS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];

export function createGrandPrixSystem(seed = {}) {
  let state = {
    divisionIndex: Number(seed.divisionIndex || 0),
    pips: Number(seed.pips || 0),
    wins: Number(seed.wins || 0),
    losses: Number(seed.losses || 0),
  };

  function registerMatch(didWin) {
    if (didWin) {
      state.wins += 1;
      state.pips += 1;
      if (state.pips >= 3 && state.divisionIndex < DIVISIONS.length - 1) {
        state.divisionIndex += 1;
        state.pips = 0;
      }
    } else {
      state.losses += 1;
      state.pips = Math.max(0, state.pips - 1);
    }
    return getSnapshot();
  }

  function getSnapshot() {
    return {
      ...state,
      division: DIVISIONS[state.divisionIndex],
      targetPips: 3,
    };
  }

  return {
    registerMatch,
    getSnapshot,
  };
}
