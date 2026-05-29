function now() {
  return Date.now();
}

export function createQueueSystem() {
  let entry = null;

  function join(type, durationSeconds, meta = {}) {
    entry = {
      type,
      durationSeconds,
      joinedAt: now(),
      expiresAt: now() + durationSeconds * 1000,
      meta,
    };
    return { ...entry };
  }

  function cancel() {
    const prev = entry;
    entry = null;
    return prev;
  }

  function get() {
    if (!entry) return null;
    return {
      ...entry,
      remainingSeconds: Math.max(0, Math.ceil((entry.expiresAt - now()) / 1000)),
    };
  }

  function isActive() {
    const current = get();
    return Boolean(current && current.remainingSeconds > 0);
  }

  return {
    join,
    cancel,
    get,
    isActive,
  };
}
