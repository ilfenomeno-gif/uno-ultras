export function createVfxSystem(options = {}) {
  const enabled = options.enabled ?? true;

  function burst(element, className = "vfx-burst") {
    if (!enabled || !element) return;
    element.classList.add(className);
    setTimeout(() => {
      element.classList.remove(className);
    }, 320);
  }

  function shake(element) {
    if (!enabled || !element) return;
    element.classList.add("vfx-shake");
    setTimeout(() => {
      element.classList.remove("vfx-shake");
    }, 260);
  }

  return {
    burst,
    shake,
  };
}
