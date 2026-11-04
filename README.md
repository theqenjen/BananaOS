# BananaOS

A mobile operating system, built for the web. Boot screen, lock screen, home screen with
widgets, Control Centre, app switcher and a full suite of system apps — Browser, Phone,
Messages, Photos, Clock, Calculator, Calendar, Weather, Notes and Settings.

Device state (messages, call history, notes, wallpaper, brightness) is stored locally and
survives a reload.

## Run it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

Then open http://localhost:3000. The app runs on Vite in dev mode; edits hot-reload.

## Notes on scope

BananaOS is a browser-hosted operating-system experience, not a kernel or bootable image.
The Browser app reads real web pages through a small dev proxy (`/api/browse`), the Phone
app places simulated calls that are logged in Recents, and Messages stores real threads on
the device.
