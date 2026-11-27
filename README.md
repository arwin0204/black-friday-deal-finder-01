# black-friday-deal-finder-01

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/arwin0204/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/arwin0204/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

DealHound — a static deal-finder site for Black Friday 2026. 26 real deals,
checked at their stores on 27 Nov 2026, each with its product, store, store
link, sale price, usual price, discount, check time, price source, and an
honest verdict (NEW LOW / STRONG DEAL / GOOD DEAL / MODEST CUT).

## Run it

Serve `app/` with any static server, e.g. `python3 -m http.server -d app 8080`,
then open http://localhost:8080. No build step, no network requests: every
file the site loads lives under `app/`.

## Files

- `app/index.html` — the page
- `app/style.css` — all styling (system fonts, no external assets)
- `app/deals.js` — the 26 verified deals and price helpers
- `app/filters.js` — search, category/store/discount filters, sorting
- `app/render.js` — deal cards, top picks, stats
- `app/main.js` — wires the controls to the filters
- `main.ts` — the make.fun hand-in program (copies `app/` + `screenshots/`,
  writes `dossier.json` with the vendored library)

## Hand in

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
