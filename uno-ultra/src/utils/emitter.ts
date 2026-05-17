export type EventMap = object;

export class Emitter<M extends EventMap> {
  private listeners = new Map<keyof M, Set<(payload: M[keyof M]) => void>>();

  on<K extends keyof M>(event: K, listener: (payload: M[K]) => void): () => void {
    const bucket = this.listeners.get(event) ?? new Set<(payload: M[keyof M]) => void>();
    bucket.add(listener as (payload: M[keyof M]) => void);
    this.listeners.set(event, bucket);

    return () => {
      bucket.delete(listener as (payload: M[keyof M]) => void);
    };
  }

  emit<K extends keyof M>(event: K, payload: M[K]): void {
    const bucket = this.listeners.get(event);
    if (!bucket) return;
    for (const listener of bucket) {
      listener(payload as M[keyof M]);
    }
  }
}
