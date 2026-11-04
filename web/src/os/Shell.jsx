import React, { useRef } from 'react';
import { useOS } from './store';
import { APPS, DOCK_IDS, getApp } from './registry';
import { Icon, BatteryIcon } from './icons';
import { useNow, clockTime, longDate, shortStamp } from './hooks';

export function AppIcon({ app, size = 58 }) {
  return (
    <span
      className="app-icon"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.29),
        background: app.bg,
        color: app.ink || '#fff',
      }}
    >
      <Icon name={app.glyph} size={Math.round(size * 0.52)} strokeWidth={1.6} />
    </span>
  );
}

function BootScreen() {
  return (
    <div className="boot-screen">
      <div className="boot-logo">
        <span role="img" aria-label="Banana">
          🍌
        </span>
      </div>
      <div className="boot-wordmark">BananaOS</div>
      <div className="boot-sub">arm64 · Banana One</div>
      <div className="boot-progress">
        <div className="boot-progress-fill" />
      </div>
      <div className="boot-note">Booting kernel 1.0-plantain…</div>
    </div>
  );
}

function StatusBar({ locked, wifi, onNotifications, onControl }) {
  const now = useNow(10000);
  return (
    <div className="statusbar">
      <button type="button" className="statusbar-hit left" onClick={onNotifications} aria-label="Notification Centre">
        <span className={`statusbar-time ${locked ? 'is-hidden' : ''}`}>{clockTime(now)}</span>
      </button>
      <div className="dynamic-island" aria-hidden="true">
        <span className="island-camera" />
      </div>
      <button type="button" className="statusbar-hit right" onClick={onControl} aria-label="Control Centre">
        <Icon name={wifi ? 'wifi' : 'wifiOff'} size={16} strokeWidth={1.9} />
        <Icon name="signal" size={16} />
        <BatteryIcon level={0.82} />
      </button>
    </div>
  );
}

function LockScreen() {
  const { unlock, notifications, openApp, conversations } = useOS();
  const now = useNow(10000);
  const preview = notifications.slice(0, 3);

  const openNotification = (note) => {
    unlock();
    if (note.appId === 'messages' && note.convId) {
      openApp('messages', { threadId: note.convId });
    } else if (note.appId) {
      openApp(note.appId);
    }
  };

  return (
    <div className="lockscreen">
      <div className="lock-head">
        <div className="lock-date">{longDate(now)}</div>
        <div className="lock-clock">{clockTime(now)}</div>
      </div>

      <div className="lock-notifications">
        {preview.map((note) => (
          <button type="button" key={note.id} className="lock-card" onClick={() => openNotification(note)}>
            <AppIcon app={getApp(note.appId) || getApp('settings')} size={30} />
            <span className="lock-card-copy">
              <span className="lock-card-head">
                <strong>{note.title}</strong>
                <small>{shortStamp(note.ts)}</small>
              </span>
              <span className="lock-card-body">{note.body}</span>
            </span>
          </button>
        ))}
        {!preview.length && (
          <div className="lock-idle">No new notifications</div>
        )}
      </div>

      <div className="lock-foot">
        <button type="button" className="unlock-pill" onClick={unlock}>
          <Icon name="chevronUp" size={20} />
          <span>Swipe up to unlock</span>
        </button>
        <div className="lock-meta">
          {conversations.length} conversations · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

function HomeScreen() {
  const { openApp, unreadTotal, unreadByConversation, settings } = useOS();
  const dockApps = DOCK_IDS.map(getApp).filter(Boolean);

  return (
    <div className="home">
      <div className="home-status-space" />
      <div className="home-grid">
        {APPS.map((app) => {
          const badge = app.id === 'messages' ? unreadTotal : 0;
          return (
            <button type="button" key={app.id} className="app-tile" onClick={() => openApp(app.id)}>
              <span className="app-tile-icon">
                <AppIcon app={app} />
                {badge > 0 && <span className="app-badge">{badge}</span>}
              </span>
              <span className="app-name">{app.name}</span>
            </button>
          );
        })}
      </div>

      <div className="home-spacer" />

      <div className="page-dots" aria-hidden="true">
        <span className="dot active" />
        <span className="dot" />
      </div>

      <div className="dock">
        {dockApps.map((app) => (
          <button type="button" key={app.id} className="dock-tile" onClick={() => openApp(app.id)}>
            <AppIcon app={app} size={54} />
            {app.id === 'messages' && unreadTotal > 0 && <span className="app-badge small">{unreadTotal}</span>}
          </button>
        ))}
      </div>
      <div className="home-caption">{settings.deviceName}</div>
      <div className="home-bar-space" />
    </div>
  );
}

function NotificationPanel() {
  const { notifications, panel, setPanel, clearNotifications, openApp, unlock, locked } = useOS();
  if (panel !== 'notifications') return null;

  const open = (note) => {
    if (locked) unlock();
    if (note.appId === 'messages' && note.convId) openApp('messages', { threadId: note.convId });
    else if (note.appId) openApp(note.appId);
  };

  return (
    <div className="panel-shell" onClick={() => setPanel(null)}>
      <div className="panel notification-panel" onClick={(event) => event.stopPropagation()}>
        <div className="panel-head">
          <span className="panel-time">{clockTime(new Date())}</span>
          <button type="button" className="text-button" onClick={clearNotifications} disabled={!notifications.length}>
            Clear all
          </button>
        </div>
        <div className="notification-list">
          {notifications.map((note) => (
            <button type="button" key={note.id} className="notification-card" onClick={() => open(note)}>
              <AppIcon app={getApp(note.appId) || getApp('settings')} size={34} />
              <span className="notification-copy">
                <span className="notification-head">
                  <strong>{note.title}</strong>
                  <small>{shortStamp(note.ts)}</small>
                </span>
                <span className="notification-body">{note.body}</span>
              </span>
            </button>
          ))}
          {!notifications.length && (
            <div className="panel-empty">
              <Icon name="check" size={22} />
              <span>You’re all caught up</span>
            </div>
          )}
        </div>
        <div className="grabber" aria-hidden="true" />
      </div>
    </div>
  );
}

function ToggleTile({ name, label, meta, active, onClick }) {
  return (
    <button type="button" className={`cc-tile ${active ? 'on' : ''}`} onClick={onClick} aria-pressed={active}>
      <span className="cc-tile-icon">
        <Icon name={name} size={20} />
      </span>
      <span className="cc-tile-label">{label}</span>
      <span className="cc-tile-meta">{meta}</span>
    </button>
  );
}

function ControlPanel() {
  const { panel, setPanel, settings, updateSettings, openApp, lock } = useOS();
  if (panel !== 'control') return null;
  const set = (key) => () => updateSettings({ [key]: !settings[key] });

  return (
    <div className="panel-shell" onClick={() => setPanel(null)}>
      <div className="panel control-panel" onClick={(event) => event.stopPropagation()}>
        <div className="panel-handle" />
        <div className="cc-grid">
          <ToggleTile
            name={settings.wifi ? 'wifi' : 'wifiOff'}
            label="Wi‑Fi"
            meta={settings.wifi ? 'GroveNet' : 'Off'}
            active={settings.wifi}
            onClick={set('wifi')}
          />
          <ToggleTile
            name="bluetooth"
            label="Bluetooth"
            meta={settings.bluetooth ? 'AirPods' : 'Off'}
            active={settings.bluetooth}
            onClick={set('bluetooth')}
          />
          <ToggleTile
            name="airplane"
            label="Airplane"
            meta={settings.airplane ? 'On' : 'Off'}
            active={settings.airplane}
            onClick={set('airplane')}
          />
          <ToggleTile
            name="moon"
            label="Focus"
            meta={settings.dnd ? 'Do Not Disturb' : 'Off'}
            active={settings.dnd}
            onClick={set('dnd')}
          />
        </div>

        <div className="cc-slider">
          <Icon name="sun" size={18} />
          <input
            type="range"
            min="20"
            max="100"
            value={settings.brightness}
            onChange={(event) => updateSettings({ brightness: Number(event.target.value) })}
            aria-label="Brightness"
          />
        </div>
        <div className="cc-slider">
          <Icon name="speaker" size={18} />
          <input
            type="range"
            min="0"
            max="100"
            value={settings.volume}
            onChange={(event) => updateSettings({ volume: Number(event.target.value) })}
            aria-label="Volume"
          />
        </div>

        <div className="cc-footer">
          <button type="button" className="cc-round" onClick={() => openApp('settings')}>
            <Icon name="settings" size={20} />
            <span>Settings</span>
          </button>
          <button type="button" className="cc-round" onClick={lock}>
            <Icon name="lock" size={20} />
            <span>Lock</span>
          </button>
          <button type="button" className="cc-round" onClick={set('flashlight')}>
            <Icon name={settings.flashlight ? 'flashlight' : 'flashlight'} size={20} />
            <span>{settings.flashlight ? 'Torch on' : 'Torch'}</span>
          </button>
        </div>
        <div className="grabber" aria-hidden="true" />
      </div>
    </div>
  );
}

function AppSwitcher() {
  const { panel, setPanel, recents, openApp, goHome, conversations } = useOS();
  if (panel !== 'switcher') return null;
  const apps = recents.map(getApp).filter(Boolean);

  return (
    <div className="panel-shell switcher-shell" onClick={() => setPanel(null)}>
      <div className="switcher" onClick={(event) => event.stopPropagation()}>
        <div className="switcher-head">
          <span>App Switcher</span>
          <button type="button" className="text-button" onClick={goHome}>
            Done
          </button>
        </div>
        <div className="switcher-row">
          {apps.map((app) => (
            <button type="button" key={app.id} className="switcher-card" onClick={() => openApp(app.id)}>
              <span className="switcher-thumb" style={{ background: app.bg }}>
                <span className="switcher-glyph" style={{ color: app.ink || '#fff' }}>
                  <Icon name={app.glyph} size={40} strokeWidth={1.4} />
                </span>
              </span>
              <span className="switcher-label">
                <AppIcon app={app} size={24} />
                {app.name}
                {app.id === 'messages' && conversations.some((c) => c.unread) && <span className="dot-live" />}
              </span>
            </button>
          ))}
          {!apps.length && <div className="panel-empty">No recent apps</div>}
        </div>
        <div className="grabber" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function Shell() {
  const os = useOS();
  const { booted, locked, app, panel, wallpaper, settings, unlock, goHome, setPanel } = os;
  const gesture = useRef(null);
  const activeApp = app ? getApp(app.id) : null;
  const ActiveComponent = activeApp?.component;

  const onPointerDown = (event) => {
    if (!booted) return;
    const rect = event.currentTarget.getBoundingClientRect();
    gesture.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    };
  };

  const onPointerUp = (event) => {
    const start = gesture.current;
    gesture.current = null;
    if (!start || !booted) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - rect.left - start.x;
    const dy = event.clientY - rect.top - start.y;
    if (Math.abs(dx) > Math.abs(dy) * 1.6) return;

    if (start.y < 58 && dy > 46) {
      if (locked) return;
      if (panel) setPanel(null);
      else setPanel(start.x > start.w / 2 ? 'control' : 'notifications');
      return;
    }

    if (start.y > start.h - 58 && dy < -46) {
      if (locked) {
        unlock();
        return;
      }
      if (panel) {
        setPanel(null);
        return;
      }
      if (app) goHome();
      else setPanel('switcher');
    }
  };

  return (
    <div className="stage">
      <div className="device">
        <div className="device-buttons" aria-hidden="true">
          <span className="btn-silent" />
          <span className="btn-vol up" />
          <span className="btn-vol down" />
          <span className="btn-power" />
        </div>

        <div
          className="screen"
          style={{ '--wall': wallpaper.css }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div className="wallpaper" style={{ background: wallpaper.css }} />
          {settings.flashlight && <div className="torch-glow" />}

          {!booted && <BootScreen />}

          {booted && (
            <>
              {!locked && <HomeScreen />}
              {ActiveComponent && (
                <div className="app-layer" key={app.id}>
                  <ActiveComponent params={app.params} />
                </div>
              )}
              {locked && <LockScreen />}
              <StatusBar
                locked={locked}
                wifi={settings.wifi && !settings.airplane}
                onNotifications={() => {
                  if (locked) return;
                  os.togglePanel('notifications');
                }}
                onControl={() => {
                  if (locked) return;
                  os.togglePanel('control');
                }}
              />
              <NotificationPanel />
              <ControlPanel />
              <AppSwitcher />
              {!locked && (
                <button
                  type="button"
                  className="home-bar"
                  aria-label="Home"
                  onClick={goHome}
                  onDoubleClick={() => setPanel('switcher')}
                >
                  <span className="home-bar-pill" />
                </button>
              )}
              <div className="brightness-veil" style={{ opacity: (100 - settings.brightness) / 150 }} />
            </>
          )}
        </div>
      </div>
      <div className="stage-caption">
        BananaOS 1.0 “Plantain” · arm64 · {settings.deviceName}
      </div>
    </div>
  );
}
