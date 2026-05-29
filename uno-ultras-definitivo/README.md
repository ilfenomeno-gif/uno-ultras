# UNO Ultras Definitivo

Beta demo ricostruita da zero prendendo come base tecnica `uno-ultra` e come riferimento funzionale il monolite `uno_ultra_v52 (1) (2).html` (non modificato).

## Cosa include
- App multipagina interna: Home, Gioca, Shop, Impostazioni, Profilo, Classifica.
- Matrice modalita completa per:
  - UNO
  - Ruba Mazzetto
  - Scopa
  - Poker
  - Burraco
  - Blackjack
  - Millemiglia
  - Scala 40
- Formati disponibili: 1v1, 3 giocatori, 4 giocatori.
- Gameplay UNO completo in demo (AI bot, turni, penalita UNO, vittoria, progressione locale).
- Profilo persistente in localStorage (MMR, crediti, statistiche, titoli).
- Copia reference del monolite in `public/legacy/uno_ultra_v52_reference.html` (originale non toccato).

## Avvio
```bash
npm install
npm run dev
```

URL di default: `http://localhost:5174`

## Nota beta
Le altre modalita oltre UNO sono gia presenti con interfaccia e wiring di lancio, pronte per il porting logico completo per fase successiva.
