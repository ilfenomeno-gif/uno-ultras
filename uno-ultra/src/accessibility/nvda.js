export function announce(message, priority = 'polite') {
  const id = priority === 'assertive' ? 'nvda-live-assertive' : 'nvda-live-polite';
  const node = document.getElementById(id);
  if (!node) return;
  node.textContent = '';
  setTimeout(() => {
    node.textContent = message;
  }, 30);
}
