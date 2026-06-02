import { profile } from '../core/store';

export function renderShop(): string {
  const items = [
    { id: 'title-pass', name: 'Pass Targhette', desc: 'Sblocco progressivo targhette dedicate.', cost: 450 },
    { id: 'legendary-box', name: 'Cassa Leggendaria', desc: 'Drop titoli premium e FX.', cost: 800 },
    { id: 'xp-token', name: 'Token XP', desc: 'Boost progressione per 3 match.', cost: 120 }
  ];

  const cards = items
    .map(
      (item) => `
      <article class="panel compact">
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        <button class="btn-primary" type="button" data-action="buy-item" data-cost="${item.cost}" data-item-id="${item.id}" aria-label="Acquista ${item.name} per ${item.cost} crediti">
          Acquista ${item.cost}
        </button>
      </article>
    `
    )
    .join('');

  return `
    <section class="panel">
      <h2>Shop</h2>
      <p>I tuoi crediti: <strong id="shop-credits">${profile.credits}</strong></p>
      <div class="grid three">${cards}</div>
    </section>
  `;
}
