import { createQueueSystem } from "./queue.js";

const UCS_TIERS = ["Open", "Contenders", "Champions", "Legends"];

export function createUcsSystem(profile = {}) {
  const queue = createQueueSystem();
  let circuit = {
    points: Number(profile.circuitPoints || 0),
    division: 0,
    eventsPlayed: 0,
  };

  function getTier() {
    return UCS_TIERS[Math.min(UCS_TIERS.length - 1, circuit.division)];
  }

  function joinQueue(durationSeconds = 90) {
    return queue.join("UCS", durationSeconds, { tier: getTier(), points: circuit.points });
  }

  function registerResult(placement) {
    const normalized = Math.max(1, Number(placement || 8));
    const gain = Math.max(10, 90 - normalized * 8);
    circuit = {
      points: circuit.points + gain,
      division: Math.min(UCS_TIERS.length - 1, Math.floor((circuit.points + gain) / 180)),
      eventsPlayed: circuit.eventsPlayed + 1,
    };
    return {
      ...circuit,
      tier: getTier(),
      gain,
    };
  }

  function getSnapshot() {
    return {
      ...circuit,
      tier: getTier(),
      queue: queue.get(),
    };
  }

  return {
    joinQueue,
    registerResult,
    getSnapshot,
    cancelQueue: queue.cancel,
  };
}
