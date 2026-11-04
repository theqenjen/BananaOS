# BananaOS — agent notes

## What this is

BananaOS is a mobile operating system experience built as a Vite + React web app: boot
screen, lock screen, home screen with widget and dock, Control Centre, app switcher,
notification banners and eleven system apps (Browser, Phone, Messages, Photos, Clock,
Calculator, Calendar, Weather, Notes, Settings).

There is no native or kernel component. A bootable ARM64 OS image cannot be produced in
this environment; the shell and apps run in the browser and are the product.

## Running it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- Service `web` runs `npm install` on boot (dependencies sit in the `node_modules` volume)
  and then Vite on port 3000. Source is bind-mounted, so edits hot-reload.
- Vite is configured for the sandbox only when `BASE44_PREVIEW_MODE=1`: host allowlist from
  `BASE44_SANDBOX_HOST_DOMAIN`, `wss` HMR on port 443, and polling file watch. With the flag
  unset, Vite keeps its normal defaults.

## Things worth knowing

- `server/browserProxy.js` is a Vite dev middleware at `/api/browse?url=…`. It fetches a real
  page, strips scripts/frames/event handlers, injects a `<base>` tag and returns JSON. The
  Browser app renders the result in a sandboxed iframe; if the sandbox has no outbound
  network the app shows its own error page and the built-in BananaNet pages still work.
- All device state (messages, calls, notes, settings, brightness, wallpaper) persists in
  `localStorage` under `bananaos.state.v1`. Deleting that key is the factory reset.
- The OS is a single page; there is no router. Navigation lives in `src/os/OSProvider.jsx`
  (`ui.phase`, `ui.activeApp`, `ui.recents`).
- Apps are registered in `src/os/appRegistry.js` and rendered by
  `src/components/AppHost.jsx`. Add an app in both places plus `src/apps/`.
- Phone calls and message replies are simulated: `sendMessage` schedules a canned reply
  through `pickReply()` in `src/os/utils.js`, and call audio is a synthesised tone.

## Verifying

- `/` serves the boot screen, then the lock screen after ~1.5s, then the home screen.
- Quick check: `curl -s localhost:3000/ | grep -q 'id="root"'`.
- In the preview: tap the unlock pill, tap the Phone icon, dial digits, press the green call
  button, end the call, then confirm the entry appears under Recents.
