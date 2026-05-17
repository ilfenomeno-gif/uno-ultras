export function renderBootScreen(root, state) {
  if (!root) return;

  root.innerHTML = `
    <main class="boot-shell">
      <h1>UNO Ultra Modular</h1>
      <p>Bootstrap Fase 1 pronto. Stato iniziale valido: ${String(Boolean(state))}</p>
    </main>
  `;
}
