# UNO-ULTRAS Repository Organization Plan

## Current root layout

- openclaw-agent-system
- uno
- uno-ultra
- uno-ultras-definitivo

## Canonical product target

- Active app target: uno-ultras-definitivo
- Historical references: uno, uno-ultra
- External tooling project: openclaw-agent-system (should be split to dedicated repository)

## Immediate actions applied

1. Added root .gitignore for node_modules, dist, env files, and binary office artifacts.
2. Planned index cleanup for tracked node_modules and .docx artifacts.
3. Added governance docs to make repository intent explicit.

## Next migration steps

1. Move active webapp to a single root app folder (or promote uno-ultras-definitivo as canonical root).
2. Freeze legacy trees under archived prefixes (legacy-v1, legacy-v2) or branches.
3. Extract openclaw-agent-system into dedicated repository.
4. Keep documentation in markdown under docs/ and stop tracking binary office formats.

## Branching recommendation

- main: only active product app + docs
- legacy/v1: historical content from uno
- legacy/v2: historical content from uno-ultra

## Safety note

Index cleanup commands should use --cached to avoid deleting local working copies.
