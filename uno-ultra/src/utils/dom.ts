export const el        = (id: string): HTMLElement | null => document.getElementById(id);
export const setText   = (id: string, txt: string): void => { const e = el(id); if (e) e.textContent = txt; };
export const setStyle  = (id: string, prop: string, val: string): void => {
  const e = el(id) as HTMLElement & { style: CSSStyleDeclaration } | null;
  if (e) e.style.setProperty(prop, val);
};
export const qs        = <T extends Element>(sel: string): T | null => document.querySelector<T>(sel);
export const qsa       = <T extends Element>(sel: string): T[] => [...document.querySelectorAll<T>(sel)];
