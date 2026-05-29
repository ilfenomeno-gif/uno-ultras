export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function nextIndex(current, length, direction) {
  return (current + direction + length) % length;
}

export function cardLabel(card) {
  if (!card) return "-";
  if (card.col === "w") {
    if (card.val === "w4") return "W+4";
    return "WILD";
  }
  return `${card.col.toUpperCase()} ${String(card.val).toUpperCase()}`;
}

export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function el(id) {
  return document.getElementById(id);
}

export function setText(id, value) {
  const node = typeof id === "string" ? el(id) : id;
  if (node) node.textContent = value;
  return node;
}

export function setHTML(id, value) {
  const node = typeof id === "string" ? el(id) : id;
  if (node) node.innerHTML = value;
  return node;
}

export function setStyle(id, property, value) {
  const node = typeof id === "string" ? el(id) : id;
  if (node) node.style[property] = value;
  return node;
}

export function showScr(id) {
  document.querySelectorAll(".scr").forEach((node) => {
    node.classList.toggle("on", node.id === id);
  });
  return el(id);
}

export function showOv(id, display = "flex") {
  const node = el(id);
  if (node) node.style.display = display;
  return node;
}

export function hideOv(id) {
  const node = el(id);
  if (node) node.style.display = "none";
  return node;
}

export function safePatch(name, nextImpl) {
  if (!name || typeof nextImpl !== "function") return null;
  const current = window[name];
  window[name] = typeof current === "function"
    ? function patchedFunction(...args) {
        return nextImpl.call(this, current.bind(this), ...args);
      }
    : function patchedFunction(...args) {
        return nextImpl.call(this, null, ...args);
      };
  return window[name];
}

export function installUtilityBridge() {
  const api = {
    shuffle,
    nextIndex,
    cardLabel,
    delay,
    el,
    setText,
    setHTML,
    setStyle,
    showScr,
    showOv,
    hideOv,
    safePatch,
  };

  window.UnoUltraModules = window.UnoUltraModules || {};
  window.UnoUltraModules.utils = api;

  if (typeof window.el !== "function") window.el = el;
  if (typeof window.setText !== "function") window.setText = setText;
  if (typeof window.showScr !== "function") window.showScr = showScr;
  if (typeof window.showOv !== "function") window.showOv = showOv;
  if (typeof window.hideOv !== "function") window.hideOv = hideOv;
  if (typeof window.safePatch !== "function") window.safePatch = safePatch;

  return api;
}
