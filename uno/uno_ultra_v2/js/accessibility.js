export function createAccessibilitySystem(options = {}) {
  const nvdaEnabled = options.nvdaEnabled ?? false;
  const liveRegionId = "a11y-live";

  function ensureLiveRegion() {
    let el = document.getElementById(liveRegionId);
    if (el) return el;
    el = document.createElement("div");
    el.id = liveRegionId;
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-atomic", "true");
    el.style.position = "absolute";
    el.style.width = "1px";
    el.style.height = "1px";
    el.style.overflow = "hidden";
    el.style.clipPath = "inset(50%)";
    document.body.appendChild(el);
    return el;
  }

  function announce(message) {
    if (!nvdaEnabled) return;
    const live = ensureLiveRegion();
    live.textContent = "";
    setTimeout(() => {
      live.textContent = String(message || "");
    }, 25);
  }

  function applyColorblindClass(enabled) {
    document.body.classList.toggle("a11y-colorblind", !!enabled);
  }

  return {
    announce,
    applyColorblindClass,
  };
}
