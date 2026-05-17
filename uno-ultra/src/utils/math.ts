export const clamp   = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));
export const lerp    = (a: number, b: number, t: number): number => a + (b - a) * t;
export const hashStr = (s: string): number =>
  [...s].reduce((h, c) => (((h << 5) - h) + c.charCodeAt(0)) | 0, 0);
export const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
