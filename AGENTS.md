# AGENTS.md — BananaOS

BananaOS is a mobile operating system that runs in the browser: boot sequence, lock screen,
home screen, Control Centre, and a set of working apps. It is a Vite + React frontend with a
small Express/SQLite backend for messages, calls, notes, photos and device settings.

## Running it

```bash
docker compose -f docker-compose.base44.yml up -d
```

- `web` runs Vite in dev mode on container port 5173, published on host **3000**. This is the
  only public entry point: the browser calls `/api/*`, which Vite proxies to `http://api:8000`.
- `api` runs `node --watch server.js` (auto-restarts on backend edits) on the internal network.
- Frontend edits hot-reload; backend edits restart the watcher. Dependency changes need
  `docker compose -f docker-compose.base44.yml restart api web` because both services run `npm ci`
  at startup.

Health: `curl http://localhost:3000/` and `curl http://localhost:3000/api/health`.

## Data

SQLite lives on the `bananaos-api-data` volume (`/app/data/bananaos.db`), so it survives restarts.
Schema and seed content live in `backend/db.js`; seeding only runs when a table is empty. To get a
fresh demo device, remove the volume:

```bash
docker compose -f docker-compose.base44.yml down
docker volume rm app_bananaos-api-data
docker compose -f docker-compose.base44.yml up -d
```

Seed timestamps are computed at first boot relative to "now", so relative times ("26m") look right
on a new volume.

## Sandbox / preview configuration

`frontend/vite.config.js` gates two sandbox-only settings on `BASE44_PREVIEW_MODE === '1'`:

- `server.allowedHosts` includes `.<BASE44_SANDBOX_HOST_DOMAIN>` so the rotating proxy hostname is
  accepted (Vite 403s unknown hosts otherwise).
- `server.hmr` uses `wss` on port 443 so hot reload works through the HTTPS preview proxy.

With the flag unset, Vite behaves as a normal local dev server. Never hardcode resolved
`BASE44_*` values in files.

## Layout

- `frontend/src/App.jsx` — OS state machine (boot → lock → home), open-app stack, overlays.
- `frontend/src/os/` — boot, lock, home, status bar, Control Centre, recents, app window.
- `frontend/src/apps/` — one file per app; `apps/browser/` holds the BananaNet sites and content.
- `frontend/src/state/DeviceContext.jsx` — theme, wallpaper, connectivity, brightness, battery;
  persisted to `/api/settings`.
- `frontend/src/styles/` — `base.css` (device chrome, tokens), `home.css`, `apps.css` (shared app
  UI), then one stylesheet per app cluster.
- `backend/server.js` — REST API; `backend/db.js` — schema + seed.

## Verifying changes

There is no test suite. Check the running app instead: boot it, unlock with "Swipe up to unlock",
and drive the affected screen. Useful selectors: `.app-icon` (home icons, `aria-label` = app name),
`.app-window.is-active .home-bar` (home gesture), `.statusbar .sb-right` (Control Centre), and the
per-app roots (`.phone`, `.messages`, `.browser`, `.weather`, …). Long-press the home bar for recents.
