# BananaOS

**BananaOS 1.0 “Plantain”** — a mobile operating system you can pick up and use in the browser.

It boots, locks, unlocks, switches apps, takes notifications, and runs a set of apps that actually
work. It identifies as an arm64 device (Settings and `uname` both report `arm64`), and it is built
around a real network stack for its browser.

## What it honestly is

BananaOS is a **browser-based mobile OS environment** with an arm64 userland identity. It is **not**
a bootable ARM64 kernel: there is no bootloader, no hardware abstraction layer and nothing here runs
on a real phone. Everything you see and use is the OS implementation in this repository, running on
the web runtime — which is what makes it usable right now, in any browser, without flashing a device.

## What is in the box

**The system**

- Boot sequence with progress, then a lock screen (swipe up or tap to unlock)
- Home screen with app grid, dock, notification badges, wallpaper picker
- Status bar, dynamic island, and live clock
- **Control Centre** (pull down from the top right, or tap the status-bar icons): Wi-Fi, Bluetooth,
  Airplane, Focus, brightness, volume, torch, lock
- **Notification Centre** (pull down from the top left, or tap the clock): real notifications from
  Messages, tap to jump into the conversation
- **App Switcher** (swipe up from the bottom edge on the home screen, double-click the home bar):
  recent apps as cards
- Edge-swipe gestures (bottom edge up = home, top edges down = panels) plus clickable fallbacks
- Lock, wallpaper, brightness and volume settings persisted on the device (`localStorage`)

**Apps**

| App | What it does |
| --- | --- |
| **Browser** | Real web browsing. Pages are fetched through the bundled network service and rendered as readable text with clickable links; the address bar searches when the input is not a URL. |
| **Phone** | Keypad with contact matching, contacts list, recents with durations, and a live in-call screen (mute, speaker, running timer, call log). |
| **Messages** | Threads, chat bubbles, unread badges, and automatic replies; incoming replies raise notifications and badges. |
| **Camera** | Live camera capture into Photos (requires a camera and permission). |
| **Photos** | Grid gallery, full-screen viewer, delete; sample photos included. |
| **Clock** | World clocks, countdown timer with presets, stopwatch with laps. |
| **Calculator** | Full expression calculator with its own parser (no `eval`). |
| **Notes** | List and editor, autosaved on the device. |
| **Terminal** | `bsh` with `help`, `uname`, `neofetch`, `ls`, `open <app>`, `date`, `uptime`, `echo`, `clear`. |
| **Settings** | Device name, wallpapers, brightness/volume, connectivity toggles, storage, erase device. |

## Running it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

Then open <http://localhost:3000>.

- `web` — Vite dev server on port 3000, serving `web/` with live reload; proxies `/api` to the API.
- `api` — dependency-free Node service on 8000: `/api/health`, `/api/browse?url=…`, `/api/search?q=…`.

No environment variables or secrets are required.

## Project layout

```
api/server.mjs              page fetching + text extraction + search
web/src/os/                 the operating system
  store.jsx                 system state (apps, settings, notifications, messages)
  Shell.jsx                 device frame, boot, lock, home, panels, gestures
  registry.jsx              installed apps (add an app here)
  icons.jsx, AppFrame.jsx   icon set and app chrome
  hooks.js, storage.js      clock/format helpers and on-device persistence
web/src/apps/               one file per app
web/src/styles.css          the whole OS surface
```

## Notes

- The Camera app needs a real camera and browser permission; without one it shows a clear
  “Camera unavailable” state instead of failing.
- Device data (messages, notes, photos, settings, call log) lives in `localStorage` under
  `bananaos:` keys and is wiped by Settings → Erase all content and settings.
- The Browser rejects private/internal addresses; it is a reading proxy, not an open relay.
