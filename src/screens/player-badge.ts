export interface BadgePlayer {
  name: string;
  cardCount: number;
  isActive: boolean;
  position: 'top' | 'left' | 'right';
  icon?: string;
  title?: string;
}

export function renderPlayerBadge(p: BadgePlayer): string {
  const posClass = `badge-${p.position}`;
  return `
    <div class="fn-player-badge ${posClass} ${p.isActive ? 'active' : ''}">
      <div class="fn-badge-avatar">${p.icon ?? p.name.charAt(0).toUpperCase()}</div>
      <div class="fn-badge-info">
        <span class="fn-badge-name">${p.name}</span>
        ${p.title ? `<span class="fn-badge-title">${p.title}</span>` : ''}
        <span class="fn-badge-cards">🃏 ${p.cardCount}</span>
      </div>
      ${p.isActive ? '<div class="fn-badge-turn-dot"></div>' : ''}
    </div>
  `;
}

export function renderCardBack(count: number, compact = false): string {
  return `
    <div class="fn-card-back-stack ${compact ? 'compact' : ''}">
      <div class="fn-card-back">${count}</div>
      <div class="fn-card-back-shadow"></div>
    </div>
  `;
}
