# Leonida Trophy Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/rezasgimang/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/rezasgimang/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

The complete, offline trophy guide and tracker for **Grand Theft Auto VI** on PlayStation 5: all **55 trophies** (1 Platinum, 2 Gold, 6 Silver, 46 Bronze) with their official names, descriptions and grades, a guide to each in plain words that cites its sources, a five-phase roadmap to the platinum, and a checklist that saves your progress in the browser.

What it does:

- **Tracker** — tick trophies off as you earn them; progress is saved in localStorage, with export to a file and import back. Progress bar plus per-grade counts (Platinum 0/1, Gold 0/2, Silver 0/6, Bronze 0/46).
- **Filters** — by kind (story, missable, collectibles, activities, online — the game has 0 online trophies), by grade, and by search.
- **Spoiler setting** — hides story trophy names, descriptions and guides until you tick them as earned.
- **Roadmap** — story first, the Chapter 1 meditation early, collectibles as you go, cleanup after the finale. The one potentially missable trophy, **Positive Mental Attitude**, is flagged throughout with its Chapter 1 warning.
- **Honest guides** — every guide is written in our own words and cites its sources (OutputLag, Playday, GTABase, Press Start). Steps the community has not yet confirmed are marked **unconfirmed** instead of guessed.

Unofficial fan guide — not affiliated with Rockstar Games, Sony or PlayStation. No Rockstar logo or official artwork anywhere in the app.

## Run it

```sh
node serve.ts
# then open http://localhost:8080
```

No build step, no network: `app/` is plain static files (HTML, CSS, ES modules, one JSON data file) that work with the network off.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

---

<sub>Entered on [make.fun](https://make.fun/?ref=&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
