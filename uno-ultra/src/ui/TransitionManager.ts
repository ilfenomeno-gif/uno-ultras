export function showTransition(msg: string, cb?: () => void, delay = 700): void {
  const el = document.getElementById('ov-transition');
  if (el) {
    (el.querySelector('.tr-msg') as HTMLElement | null)
      ?.textContent !== undefined
      && ((el.querySelector('.tr-msg') as HTMLElement).textContent = msg);
    el.classList.add('on');
  }
  setTimeout(() => { el?.classList.remove('on'); cb?.(); }, delay);
}
