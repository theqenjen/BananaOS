import React from 'react';
import { AppFrame } from '../os/AppFrame';
import { Icon } from '../os/icons';
import { useOS, WALLPAPERS } from '../os/store';

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`switch ${checked ? 'on' : ''}`}
      onClick={onChange}
    >
      <span className="switch-knob" />
    </button>
  );
}

function Group({ title, children }) {
  return (
    <section className="settings-group">
      <h3>{title}</h3>
      <div className="settings-card">{children}</div>
    </section>
  );
}

export default function Settings() {
  const { settings, updateSettings, photos, conversations, resetDevice, openApp } = useOS();
  const toggle = (key) => () => updateSettings({ [key]: !settings[key] });

  return (
    <AppFrame title="Settings" bodyClassName="settings-body">
      <Group title="Device">
        <div className="settings-row stacked">
          <label htmlFor="device-name">Name</label>
          <input
            id="device-name"
            className="text-input"
            value={settings.deviceName}
            onChange={(event) => updateSettings({ deviceName: event.target.value.slice(0, 32) })}
            placeholder="Banana One"
          />
        </div>
        <div className="settings-row">
          <span>Model</span>
          <span className="row-value">Banana One</span>
        </div>
        <div className="settings-row">
          <span>Software</span>
          <span className="row-value">BananaOS 1.0 “Plantain”</span>
        </div>
        <div className="settings-row">
          <span>Architecture</span>
          <span className="row-value">arm64</span>
        </div>
      </Group>

      <Group title="Appearance">
        <div className="settings-block">
          <span className="settings-label">Wallpaper</span>
          <div className="wallpaper-row">
            {Object.entries(WALLPAPERS).map(([key, item]) => (
              <button
                type="button"
                key={key}
                className={`wallpaper-swatch ${settings.wallpaper === key ? 'active' : ''}`}
                style={{ background: item.css }}
                onClick={() => updateSettings({ wallpaper: key })}
                aria-label={`Wallpaper ${item.label}`}
                aria-pressed={settings.wallpaper === key}
              >
                {settings.wallpaper === key && <Icon name="check" size={16} />}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-block">
          <div className="slider-row">
            <Icon name="sun" size={18} />
            <input
              type="range"
              min="20"
              max="100"
              value={settings.brightness}
              onChange={(event) => updateSettings({ brightness: Number(event.target.value) })}
              aria-label="Brightness"
            />
            <span className="slider-value">{settings.brightness}%</span>
          </div>
          <div className="slider-row">
            <Icon name="speaker" size={18} />
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              onChange={(event) => updateSettings({ volume: Number(event.target.value) })}
              aria-label="Volume"
            />
            <span className="slider-value">{settings.volume}%</span>
          </div>
        </div>
      </Group>

      <Group title="Connectivity">
        <div className="settings-row">
          <span>Wi‑Fi</span>
          <div className="settings-row-end">
            <span className="row-muted">{settings.wifi ? 'GroveNet' : 'Off'}</span>
            <Toggle checked={settings.wifi} onChange={toggle('wifi')} label="Wi-Fi" />
          </div>
        </div>
        <div className="settings-row">
          <span>Bluetooth</span>
          <Toggle checked={settings.bluetooth} onChange={toggle('bluetooth')} label="Bluetooth" />
        </div>
        <div className="settings-row">
          <span>Airplane Mode</span>
          <Toggle checked={settings.airplane} onChange={toggle('airplane')} label="Airplane mode" />
        </div>
        <div className="settings-row">
          <span>Do Not Disturb</span>
          <Toggle checked={settings.dnd} onChange={toggle('dnd')} label="Do not disturb" />
        </div>
      </Group>

      <Group title="Storage">
        <div className="settings-row">
          <span>Photos</span>
          <span className="row-value">{photos.length} items</span>
        </div>
        <div className="settings-row">
          <span>Messages</span>
          <span className="row-value">{conversations.length} conversations</span>
        </div>
        <div className="settings-row">
          <span>Available</span>
          <span className="row-value">112.4 GB of 128 GB</span>
        </div>
      </Group>

      <Group title="About">
        <div className="settings-row">
          <span>Browser</span>
          <button type="button" className="text-button" onClick={() => openApp('browser')}>
            Open Browser
          </button>
        </div>
        <div className="settings-row">
          <span>Terminal</span>
          <button type="button" className="text-button" onClick={() => openApp('terminal')}>
            Open Terminal
          </button>
        </div>
        <p className="settings-footnote">
          BananaOS runs as a browser-based mobile environment with an arm64 userland identity. No native
          hardware is used in this preview.
        </p>
      </Group>

      <Group title="Reset">
        <button
          type="button"
          className="danger-button"
          onClick={() => {
            if (window.confirm('Erase all BananaOS data on this device?')) resetDevice();
          }}
        >
          Erase all content and settings
        </button>
      </Group>
    </AppFrame>
  );
}
