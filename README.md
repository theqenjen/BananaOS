# BananaOS

A mobile operating system that runs in your browser. Boot it, unlock it, and use it.

BananaOS is not a mockup: the home screen, Control Centre, recents switcher and apps are all
interactive, and messages, calls, notes and device settings are stored in a real database.

## What's inside

- **Boot + lock screen** — progress boot, live clock, notification cards, swipe up to unlock.
- **Home screen** — app grid, dock, widget page (weather, clock, notes), page dots.
- **Status bar and Control Centre** — live clock, signal, battery, Wi-Fi/Bluetooth/Airplane/Focus
  toggles, brightness, charging.
- **Recents switcher** — hold the home bar.
- **Apps**
  - **Phone** — keypad with contact matching, call screen with timer, mute/speaker/keypad, call
    history, contacts.
  - **Messages** — conversations, unread badges, message threads with simulated replies, new
    message picker.
  - **Browser** — tabs, address bar, back/forward, bookmarks, and BananaNet: a small internal web
    (Peel Search, The Banana Times with readable articles, Bananabook, BananaTube, Banana Store,
    WikiBanana) plus an error page for unknown domains.
  - **Photos** — grid and full-screen viewer.
  - **Weather** — current conditions, hourly strip, 6-day forecast.
  - **Clock** — world clock, alarms, stopwatch with laps, timer.
  - **Notes** — create, search, autosaving editor, delete.
  - **Calendar** — month grid with events per day.
  - **Calculator** — working four-function calculator.
  - **Music** — now playing, queue, animated playback.
  - **Settings** — theme (dark/light), six wallpapers, connectivity, brightness, battery, storage.

## Run it

```bash
docker compose -f docker-compose.base44.yml up -d
```

Open <http://localhost:3000>. The frontend is Vite + React; the API is Express + SQLite
(`better-sqlite3`). Vite proxies `/api` to the API service, so everything is served from one origin.

To reset the device and re-seed the demo data, remove the `bananaos-api-data` volume
(see `AGENTS.md`).

## Structure

```
backend/          Express API, SQLite schema and seed data
frontend/src/os/  OS shell: boot, lock, home, status bar, Control Centre, recents
frontend/src/apps/  one component per app (browser sites live in apps/browser/)
frontend/src/styles/  design tokens and per-app styles
```
