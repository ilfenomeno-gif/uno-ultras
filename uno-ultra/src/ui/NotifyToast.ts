export function notify(msg: string, duration = 2500): void {
  const el = document.createElement('div');
  el.className   = 'toast';
  el.textContent = msg;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  document.body.appendChild(el);
  setTimeout(() => el.remove(), duration);
}
