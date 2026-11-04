import { useState } from 'react'
import { useOS } from '../os/OSProvider'
import { AppShell } from '../components/AppShell'
import { Glyph } from '../os/Glyph'
import { WALLPAPERS } from '../os/seed'

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`switch ${checked ? 'is-on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="switch-knob" />
    </button>
  )
}

export function SettingsApp() {
  const { data, actions } = useOS()
  const [confirmReset, setConfirmReset] = useState(false)
  const { settings, profile } = data

  const storageKb = (() => {
    try {
      const raw = window.localStorage.getItem('bananaos.state.v1') || ''
      return `${Math.max(1, Math.round(raw.length / 1024))} KB`
    } catch {
      return '—'
    }
  })()

  return (
    <AppShell className="settings-app" title="Settings">
      <div className="settings-profile">
        <span className="profile-avatar">{profile.name.slice(0, 1).toUpperCase()}</span>
        <div>
          <strong>{profile.name || 'BananaOS user'}</strong>
          <span>{profile.handle}</span>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Profile</h2>
        <label className="field">
          <span>Name</span>
          <input
            value={profile.name}
            onChange={(event) => actions.updateProfile({ name: event.target.value })}
            placeholder="Your name"
          />
        </label>
        <label className="field">
          <span>Handle</span>
          <input
            value={profile.handle}
            onChange={(event) => actions.updateProfile({ handle: event.target.value })}
            placeholder="you@banana.os"
          />
        </label>
      </div>

      <div className="card">
        <h2 className="card-title">Wallpaper</h2>
        <div className="wallpaper-row">
          {WALLPAPERS.map((name) => (
            <button
              type="button"
              key={name}
              className={`wallpaper-swatch wallpaper-${name} ${
                settings.wallpaper === name ? 'is-active' : ''
              }`}
              onClick={() => actions.updateSettings({ wallpaper: name })}
              aria-label={`${name} wallpaper`}
              aria-pressed={settings.wallpaper === name}
            >
              {settings.wallpaper === name && <Glyph name="check" size={18} strokeWidth={2.6} />}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Display &amp; sound</h2>
        <div className="setting-row">
          <span>Brightness</span>
          <input
            type="range"
            min="35"
            max="100"
            value={Math.round(settings.brightness * 100)}
            onChange={(event) => actions.updateSettings({ brightness: Number(event.target.value) / 100 })}
            aria-label="Brightness"
          />
        </div>
        <div className="setting-row">
          <span>Keypad &amp; alert sounds</span>
          <Switch
            checked={settings.sounds}
            label="Sounds"
            onChange={(value) => actions.updateSettings({ sounds: value })}
          />
        </div>
        <div className="setting-row">
          <span>Wi-Fi</span>
          <Switch
            checked={settings.wifi && !settings.airplane}
            label="Wi-Fi"
            onChange={(value) => actions.updateSettings({ wifi: value, airplane: false })}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Device</h2>
        <div className="setting-row">
          <span>Name</span>
          <span className="setting-value">Banana Phone</span>
        </div>
        <div className="setting-row">
          <span>Software</span>
          <span className="setting-value">BananaOS 1.0 (24B71)</span>
        </div>
        <div className="setting-row">
          <span>Architecture</span>
          <span className="setting-value">ARM64 · 8-core</span>
        </div>
        <div className="setting-row">
          <span>Local storage used</span>
          <span className="setting-value">{storageKb}</span>
        </div>
        <button type="button" className="setting-row is-button" onClick={actions.lock}>
          <span>Lock screen now</span>
          <Glyph name="lock" size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="card">
        <h2 className="card-title">Reset</h2>
        <p className="muted small">
          This erases messages, call history, notes and settings stored on this device and restores
          the factory state.
        </p>
        {confirmReset ? (
          <div className="confirm-row">
            <button type="button" className="danger" onClick={actions.resetOS}>
              Erase everything
            </button>
            <button type="button" className="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className="danger wide" onClick={() => setConfirmReset(true)}>
            Reset BananaOS
          </button>
        )}
      </div>
    </AppShell>
  )
}
