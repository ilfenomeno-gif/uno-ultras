export const OverlayManager = {
  showOv(id: string): void {
    const el = document.getElementById(`ov-${id}`);
    if (el) { el.style.display = 'flex'; el.classList.add('on'); }
  },
  hideOv(id: string): void {
    const el = document.getElementById(`ov-${id}`);
    if (el) { el.classList.remove('on'); el.style.display = ''; }
  },
};
