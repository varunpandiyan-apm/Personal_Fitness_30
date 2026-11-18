# Ember — 30-Day Fitness Challenge

A desktop-first, single-page fitness challenge app. Log one honest workout a day for
thirty sequential days, keep a streak alive, evolve a character through seven stages,
and unlock a real training lesson every five workouts.

Everything runs locally in the browser. No build step, no server, no dependencies, no
accounts, no tracking.

---

## Run it

**Option 1 — just open it**

Double-click `index.html` (Chrome or Edge recommended). The app works straight from
disk and saves progress in your browser.

**Option 2 — local server (recommended if you switch browsers often)**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\serve.ps1
```

It serves this folder on `http://127.0.0.1:4321/` and opens the page. Use
`-Port 8080` for a different port, or `-NoBrowser` to skip opening a window.
Press `Ctrl+C` in the window to stop it.

---

## How the challenge works

- **Thirty sequential days.** Only the current day can be logged. The next day unlocks
  the moment you complete the current one — not on the next calendar day.
- **Tick or Cross.** A **Tick** completes the day and grows your streak. A **Cross**
  logs an honest miss: the same day stays open for another attempt, the current streak
  resets to zero, and nothing already completed is erased. A confirmation step prevents
  accidental streak resets.
- **Nothing is ever auto-missed.** Untouched days stay pending; time passing never
  breaks a streak or skips you forward.
- **Separate numbers.** Challenge day, completed workouts, current streak, best streak,
  and progress out of 30 are tracked independently.

### Character stages

A stage unlocks every five completed workouts, based on total workouts — not calendar
days, not streaks.

| Workouts | Stage |
| --- | --- |
| 0 | The Beginner |
| 5 | The Starter |
| 10 | The Builder |
| 15 | The Grinder |
| 20 | The Strong One |
| 25 | The Champion |
| 30 | Legend Mode |

### Rewards

Six short lessons, one every five workouts: progressive overload, form cues, recovery,
nutrition, consistency, and how to program what comes after day 30. They are written
content, not badges, and stay available to re-read once unlocked.

---

## Using the app

- Click the main button (or the highlighted day, or press **L**) to log today.
- **R** opens the reward shelf, **J** opens the character journey, **Esc** closes dialogs.
- The gear icon opens settings: JSON export, undo last entry, and a guarded reset.
- Progress is stored in `localStorage` and survives reloads and browser restarts.
  Clearing site data erases it, so export a backup if the log matters to you.

---

## Project structure

```
ember-30/
├── index.html            dashboard markup and modal shell
├── styles.css            design system, layout, responsive rules
├── app.js                content, state, derivation, rendering, modals
├── serve.ps1             optional local static server for Windows
├── publish.ps1           one-command publish to GitHub + Vercel
└── assets/
    ├── characters/       stage-0.png … stage-6.png (7 transparent avatars)
    └── fonts/            self-hosted Fraunces + Plus Jakarta Sans (woff2)
```

### How state is stored

State is event-sourced and intentionally small:

```json
{ "v": 1, "startedAt": "…", "events": [{ "d": 1, "r": "tick", "t": "…" }] }
```

`d` is the challenge day, `r` is `tick` or `cross`, `t` is the timestamp. Every number
shown on screen — completion, streaks, stage, rewards, which day is current — is
recomputed from that log, so undo is exact and stored data cannot drift out of sync.

---

## Deploying

The app is a plain static site, so publishing is just "copy these files somewhere that
serves them".

- **Live site:** https://personal-fitness-30.vercel.app
- **Source:** https://github.com/varunpandiyan-apm/Personal_Fitness_30

`publish.ps1` does both halves of a release in one run — it commits the folder to the
`main` branch of the GitHub repo, then uploads the site files as a new Vercel production
deployment and checks the live URL:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\publish.ps1 -Message "Sharpen reward copy"
```

Add `-GitHubOnly` or `-VercelOnly` to publish just one side. Tokens are read from
`-GitHubToken` / `-VercelToken`, then `$env:GITHUB_TOKEN` / `$env:VERCEL_TOKEN`, then
`$HOME\.ember\credentials.ps1`. No credentials are stored in this repository, and
`*.ps1` files are deliberately excluded from the website upload — they live in the repo
but are never served publicly.

Vercel is connected to this repository's `main` branch, so **any push deploys to
production automatically** — `publish.ps1 -GitHubOnly` is the normal way to release, and
Vercel builds and publishes the result. Running `publish.ps1` without that switch still
works; it additionally uploads the site files directly instead of waiting for the build.
`*.ps1`, `*.md`, and `.vercelignore` are listed in `.vercelignore`, so they stay in the
repository but are never served by the website.

---

## Design notes

- Warm, earthy palette: cream paper, mustard accent, brown and olive support, terracotta
  for missed attempts.
- Fraunces for display type, Plus Jakarta Sans for UI text — both self-hosted, so the app
  never calls out to a font CDN.
- Character art comes from the supplied stage sheet, cropped and keyed to transparent
  PNGs on a shared canvas so every stage sits on the same baseline.
