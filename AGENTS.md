# AGENTS.md — BananaOS

## What this is

A browser-based mobile OS (boot, lock screen, home screen, panels, app switcher, apps). It presents
itself as an arm64 device but it is **not** a bootable kernel and never runs on real hardware. Do not
"implement the kernel" unless the user explicitly asks for native code; the product here is the OS
experience.

## Running

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- `web` → Vite 6 dev server on host port 3000 (`web/`), live reload with polling. Proxies `/api` to `http://api:8000`.
- `api` → zero-dependency Node 22 HTTP service (`api/server.mjs`) on 8000. Restart it after edits;
  it has no watcher: `docker compose -f docker-compose.base44.yml restart api`.
- No database, no secrets, no migrations.

Smoke tests:

```bash
curl -s localhost:3000/ | head -5
curl -s localhost:3000/api/health
curl -s "localhost:3000/api/browse?url=https://en.wikipedia.org/wiki/Banana" | head -c 300
curl -s "localhost:3000/api/search?q=banana" | head -c 300
```

Tests/lint: none configured. Verify by driving the UI in the preview.

## Sandbox-specific configuration

- `web/vite.config.js` allows the preview hostname via `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`
  (set by the platform) and, only when `BASE44_PREVIEW_MODE === "1"`, appends
  `.<BASE44_SANDBOX_HOST_DOMAIN>`. With the flag unset, `allowedHosts` stays empty (Vite default).
- File watching uses polling because the source is a bind mount.
- No host allowlist/ORIGIN assumptions in app code; the API is same-origin through the Vite proxy.

## Architecture notes

- `web/src/os/store.jsx` is the single source of system state: open app, recents, panels, settings,
  notifications, conversations, photos. Auto-replies are scheduled there and raise notifications.
- `web/src/os/registry.jsx` is the app list; adding an app = one component in `web/src/apps/` plus an
  entry (id, name, glyph from `icons.jsx`, gradient, component). Dock ids live in the same file.
- Apps receive `params` (e.g. `openApp('messages', { threadId })`); components stay mounted per app
  id, so handle param changes in an effect (see Browser).
- Persistence: `web/src/os/storage.js` — `localStorage` keys prefixed `bananaos:`
  (`settings`, `notifications`, `conversations`, `photos`, `calls`, `notes`).
- The OS chrome (status bar, home bar, panels) sits above apps; app layers are opaque, so
  `app-layer` must keep an opaque background.
- Gestures are handled on `.screen` in `Shell.jsx` via pointer up/down distance from screen edges;
  every gesture also has a clickable fallback (unlock pill, status-bar halves, home bar) — keep both.
- The Browser's readability comes from `extractPage()` in `api/server.mjs`: it strips
  nav/header/footer/aside/form, prefers paragraphs over list items, and blocks private hosts.

## Gotchas

- Camera needs a real camera + permission. Headless preview reports “No camera was found on this
  device.” — that is the expected graceful state, not a bug.
- Browser pages are fetched server-side in `api`, so a sandbox without outbound network shows the
  “BananaNet is unreachable” state.
- Don't put user-supplied values under Compose `environment:`; there are currently no secrets.
