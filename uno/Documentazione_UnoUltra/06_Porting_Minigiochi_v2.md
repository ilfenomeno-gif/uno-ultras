# Porting Mini-giochi v2

## Scopo

Definire il primo blocco di porting mini-giochi dal monolite v52 verso `uno_ultra_v2` in moduli separati, mantenendo la catena di progressione e persistenza locale.

## Moduli Creati

- `uno_ultra_v2/js/minigames/shared.js`
- `uno_ultra_v2/js/minigames/scopa.js`
- `uno_ultra_v2/js/minigames/poker.js`
- `uno_ultra_v2/js/minigames/burraco.js`
- `uno_ultra_v2/js/minigames/millemiglia.js`
- `uno_ultra_v2/js/minigames/registry.js`

## Contratto Runtime

Ogni mini-gioco espone un runner con output normalizzato:

```js
{
  game: string,
  didWin: boolean,
  finalScores: [number, number],
  rounds: number,
  log: string[]
}
```

## Wiring UI

- Home screen: pannello `Mini-giochi` con select e start.
- Stato partita mini-gioco visualizzato in `#mg-status`.
- Log turni sintetico in `#mg-log`.

## Integrazione Progressione

I risultati mini-gioco vengono inoltrati a `applyMatchResult(...)` con:

- `playerCount = 2`
- `mode = 'casual'`
- `localPlayerIndex = 0`
- `finalScores` e `didWin` dal risultato mini-gioco.

Effetti:

- update XP/Level
- update MMR playlist casual
- storico partita aggiornato

## Copertura v2

La suite mini-giochi e integrata in `uno_ultra_v2` con registry unificato, runner dedicati per ogni gioco e output runtime normalizzato.

Copertura operativa presente:

- Scopa
- Ruba Mazzetto
- Scala 40
- BlackJack
- Poker
- Burraco
- Millemiglia

Integrazione trasversale presente:

- wiring UI home (`#mg-select`, `#btn-mg-start`, `#mg-status`, `#mg-log`)
- bridge progressione (`applyMatchResult`)
- persistenza storico match mini-gioco
