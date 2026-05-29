# UNO Ultra

> Piattaforma di gioco web multi-titolo: UNO (6 modalità online), Scopa, Poker, Burraco, Blackjack, Millemiglia, Ruba Mazzetto, Scala 40.

## Stack
- **TypeScript 5** + **Vite 5** — bundle + HMR
- **Vitest** — test unitari
- **SCSS** — stili modulari
- **PeerJS** — multiplayer WebRTC P2P

## Struttura
Vedi [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Monolite riversato
- Copia integrale del file legacy disponibile in `public/legacy/uno_ultra_v52.html`.
- Accesso rapido anche da `index.html` tramite il link `Apri Monolite v52`.

## Avvio
```bash
npm install
npm run dev        # dev server http://localhost:5173
npm run test       # vitest
npm run build      # produzione in /dist
```
