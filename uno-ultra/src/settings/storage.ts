/** Wrapper tipizzato localStorage con fallback in-memory */
const mem = new Map<string, unknown>();

export const store = {
  get<T>(key: string): T | null {
    try { return JSON.parse(localStorage.getItem(key) ?? 'null') as T | null; }
    catch { return (mem.get(key) as T | null) ?? null; }
  },
  set<T>(key: string, val: T): void {
    try { localStorage.setItem(key, JSON.stringify(val)); }
    catch { mem.set(key, val); }
  },
  del(key: string): void {
    try { localStorage.removeItem(key); } catch { /* */ }
    mem.delete(key);
  },
};
