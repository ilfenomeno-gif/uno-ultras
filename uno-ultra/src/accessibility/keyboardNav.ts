export function trapFocus(container: HTMLElement): () => void {
  const selector = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
  const nodes = [...container.querySelectorAll<HTMLElement>(selector)];
  if (nodes.length === 0) return () => {};

  const first = nodes[0];
  const last = nodes[nodes.length - 1];

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  container.addEventListener('keydown', onKeyDown);
  return () => container.removeEventListener('keydown', onKeyDown);
}
