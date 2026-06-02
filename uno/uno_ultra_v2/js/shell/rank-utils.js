const RANK_TABLE = [
  { minMMR: 2800, name: 'SSL', color: '#FFFFFF' },
  { minMMR: 2400, name: 'Grand Champion', color: '#FF4081' },
  { minMMR: 2000, name: 'Champion', color: '#4A9CE1' },
  { minMMR: 1600, name: 'Diamond', color: '#7EE4F8' },
  { minMMR: 1200, name: 'Platinum', color: '#D2E4E3' },
  { minMMR: 800, name: 'Gold', color: '#D39940' },
  { minMMR: 400, name: 'Silver', color: '#C0C0C0' },
  { minMMR: 0, name: 'Bronze', color: '#CD7F32' },
];

export function getRankName(mmr) {
  const value = Math.max(0, Number(mmr) || 0);
  const hit = RANK_TABLE.find((rank) => value >= rank.minMMR);
  return hit ? hit.name : 'Bronze';
}

export function getRankColor(mmr) {
  const value = Math.max(0, Number(mmr) || 0);
  const hit = RANK_TABLE.find((rank) => value >= rank.minMMR);
  return hit ? hit.color : '#CD7F32';
}
