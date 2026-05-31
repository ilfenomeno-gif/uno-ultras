export function notify(text: string): void {
  const node = document.getElementById('notify');
  if (!node) return;
  node.textContent = text;
  node.classList.add('show');
  window.setTimeout(() => node.classList.remove('show'), 1600);
}
