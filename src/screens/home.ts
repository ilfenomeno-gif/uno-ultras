export function renderHome(): string {
  return `
    <section class="hero">
      <h1>UNO ULTRAS DEFINITIVO</h1>
      <p>Beta demo completa: hub multipagina, modalita complete, progressione locale e gameplay UNO ricreato da zero.</p>
      <div class="hero-actions">
        <button data-action="goto" data-screen="play" class="btn-primary">Inizia a giocare</button>
        <button data-action="goto" data-screen="shop" class="btn-ghost">Apri Shop</button>
      </div>
    </section>
    <section class="grid three">
      <article class="panel"><h3>Modalita</h3><p>UNO, Ruba Mazzetto, Scopa, Poker, Burraco, Blackjack, Millemiglia, Scala 40 in 1v1/3/4.</p></article>
      <article class="panel"><h3>Classifica</h3><p>Sistema rank completo da Bronzo a SSL + MMR demo persistente.</p></article>
      <article class="panel"><h3>Beta pronta</h3><p>Interfaccia moderna, salvataggio locale e struttura pronta per integrazione feature monolite.</p></article>
    </section>
  `;
}
