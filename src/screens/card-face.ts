type MaybeString = string | number | undefined | null;

function normalize(value: MaybeString): string {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

export function formatUnoFace(value: MaybeString): string {
  const token = normalize(value);
  if (!token) return '?';

  const map: Record<string, string> = {
    skip: '⦸',
    salta: '⦸',
    reverse: '↺',
    giro: '↺',
    wild: '⬢',
    w: '⬢',
    jolly: '⬢',
    wild4: '+4',
    jolly4: '+4',
    '+4': '+4',
    draw2: '+2',
    '+2': '+2'
  };

  return map[token] ?? String(value);
}

export function formatClassicFace(value: MaybeString): string {
  const token = normalize(value);
  if (!token) return '?';

  const map: Record<string, string> = {
    asso: 'A',
    ace: 'A',
    re: 'K',
    king: 'K',
    regina: 'Q',
    queen: 'Q',
    fante: 'J',
    jack: 'J',
    cavallo: 'C'
  };

  return map[token] ?? String(value).toUpperCase();
}

export function formatSuitSymbol(suit: MaybeString): string {
  const token = normalize(suit);
  const map: Record<string, string> = {
    hearts: '♥',
    heart: '♥',
    h: '♥',
    diamonds: '♦',
    diamond: '♦',
    d: '♦',
    clubs: '♣',
    club: '♣',
    c: '♣',
    spades: '♠',
    spade: '♠',
    s: '♠'
  };
  return map[token] ?? String(suit ?? '');
}

export function formatMilleMigliaFace(card: { type: string; value?: number; name?: string; emoji?: string }): { main: string; sub?: string } {
  if (card.type === 'km') return { main: String(card.value ?? ''), sub: 'KM' };

  const key = normalize(card.name);
  const nameMap: Record<string, string> = {
    'semaforo rosso': 'SR',
    'ruota bucata': 'RB',
    'fine carburante': 'FC',
    incidente: 'INC',
    riparazione: 'RIP',
    cisterna: 'CIS',
    antiforatura: 'AFT',
    semaforo: 'SEM'
  };

  const typeMap: Record<string, string> = {
    hazard: 'HZ',
    remedy: 'RM',
    safety: 'SF',
    extra: 'EX'
  };

  return {
    main: nameMap[key] ?? typeMap[normalize(card.type)] ?? (card.emoji ? card.emoji : '•'),
    sub: card.emoji ?? undefined
  };
}

export function getUnoCardAriaLabel(value: MaybeString, color: MaybeString, playable: boolean): string {
  const face = formatUnoFace(value);
  const col = String(color ?? '').toLowerCase();
  return `Carta ${face} ${col}, ${playable ? 'giocabile' : 'non giocabile'}`;
}
