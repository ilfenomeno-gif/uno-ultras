import { appendReplay, loadReplays } from "./persistence.js";

export function createReplayService(limit = 50) {
  function list() {
    return loadReplays().slice(0, limit);
  }

  function record(entry) {
    return appendReplay({
      ...entry,
      snapshotLabel: entry?.snapshotLabel || `Replay ${new Date().toLocaleString("it-IT")}`,
    });
  }

  function latest() {
    return list()[0] || null;
  }

  function summarize(entry) {
    if (!entry) return "Nessun replay disponibile";
    const scores = Array.isArray(entry.finalScores) ? entry.finalScores.join("-") : "n/d";
    return `${entry.mode || "match"} | ${entry.didWin ? "win" : "loss"} | ${scores}`;
  }

  return {
    list,
    latest,
    record,
    summarize,
  };
}
