export function createSeededRng(seed) {
  let s = Math.max(1, Math.floor(seed) % 2147483647);
  return function rng() {
    s = (s * 48271) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function pickWeighted(rng, entries) {
  const total = entries.reduce((sum, e) => sum + e.weight, 0);
  const target = rng() * total;
  let acc = 0;
  for (const e of entries) {
    acc += e.weight;
    if (target <= acc) return e.value;
  }
  return entries[entries.length - 1]?.value;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
