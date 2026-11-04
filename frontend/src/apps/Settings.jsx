import { useDevice, WALLPAPERS } from '../state/DeviceContext.jsx';
import {
  Wifi,
  Bluetooth,
  Plane,
  Moon,
  SunMedium,
  Sun,
  MoonStar,
  Smartphone,
  ShieldCheck,
  BatteryMedium,
  Palette,
} from 'lucide-react';

const WALLPAPER_LABELS = {
  dusk: 'Dusk',
  citrus: 'Citrus',
  aurora: 'Aurora',
  midnight: 'Midnight',
  peach: 'Peach',
  mono: 'Graphite',
};

export default function SettingsApp() {
  const { settings, patch, battery, charging, toggleCharging } = useDevice();

  const ToggleRow = ({ icon: Icon, label, sub, value, onChange }) => (
    <div className="row setting-row">
      <span className="setting-icon">
        <Icon size={16} />
      </span>
      <div className="row-main">
        <div className="row-title">{label}</div>
        <div className="row-sub">{sub}</div>
      </div>
      <button type="button" className={`switch ${value ? 'is-on' : ''}`} onClick={onChange} aria-label={`Toggle ${label}`} />
    </div>
  );

  return (
    <div className="settings">
      <header className="app-head">
        <div>
          <h1 className="app-head-title">Settings</h1>
          <p className="app-head-sub">BananaOS · Plantain 1.0</p>
        </div>
      </header>

      <div className="settings-profile">
        <span className="settings-avatar">B</span>
        <div>
          <strong>{settings.deviceName}</strong>
          <span>Signed in · Banana Account</span>
        </div>
        <Smartphone size={18} />
      </div>

      <span className="section-label">Appearance</span>
      <div className="list">
        <div className="row setting-row">
          <span className="setting-icon">
            <Palette size={16} />
          </span>
          <div className="row-main">
            <div className="row-title">Theme</div>
            <div className="row-sub">{settings.theme === 'dark' ? 'Dark' : 'Light'} appearance</div>
          </div>
          <div className="theme-switch">
            <button
              type="button"
              className={settings.theme === 'dark' ? 'is-on' : ''}
              onClick={() => patch({ theme: 'dark' })}
              aria-label="Dark theme"
            >
              <MoonStar size={14} />
            </button>
            <button
              type="button"
              className={settings.theme === 'light' ? 'is-on' : ''}
              onClick={() => patch({ theme: 'light' })}
              aria-label="Light theme"
            >
              <Sun size={14} />
            </button>
          </div>
        </div>
      </div>

      <span className="section-label">Wallpaper</span>
      <div className="wallpaper-grid">
        {Object.entries(WALLPAPERS).map(([key, background]) => (
          <button
            key={key}
            type="button"
            className={`wallpaper-swatch ${settings.wallpaper === key ? 'is-on' : ''}`}
            onClick={() => patch({ wallpaper: key })}
          >
            <span style={{ background }} />
            <em>{WALLPAPER_LABELS[key]}</em>
          </button>
        ))}
      </div>

      <span className="section-label">Connectivity</span>
      <div className="list">
        <ToggleRow
          icon={Wifi}
          label="Wi-Fi"
          sub={settings.wifi && !settings.airplane ? 'Peel-5G · connected' : 'Off'}
          value={settings.wifi && !settings.airplane}
          onChange={() => patch({ wifi: !settings.wifi, airplane: false })}
        />
        <ToggleRow
          icon={Bluetooth}
          label="Bluetooth"
          sub={settings.bluetooth ? 'Peel Buds Pro' : 'Off'}
          value={settings.bluetooth}
          onChange={() => patch({ bluetooth: !settings.bluetooth })}
        />
        <ToggleRow
          icon={Plane}
          label="Airplane Mode"
          sub={settings.airplane ? 'Calls and data disabled' : 'Off'}
          value={settings.airplane}
          onChange={() => patch({ airplane: !settings.airplane })}
        />
        <ToggleRow
          icon={Moon}
          label="Focus"
          sub={settings.dnd ? 'Silencing notifications' : 'Off'}
          value={settings.dnd}
          onChange={() => patch({ dnd: !settings.dnd })}
        />
      </div>

      <span className="section-label">Display &amp; battery</span>
      <div className="list">
        <div className="row setting-row">
          <span className="setting-icon">
            <SunMedium size={16} />
          </span>
          <div className="row-main">
            <div className="row-title">Brightness</div>
            <input
              type="range"
              min="20"
              max="100"
              value={settings.brightness}
              onChange={(event) => patch({ brightness: Number(event.target.value) })}
              aria-label="Brightness"
              className="setting-slider"
            />
          </div>
          <span className="row-meta">{settings.brightness}%</span>
        </div>
        <button type="button" className="row setting-row" onClick={toggleCharging}>
          <span className="setting-icon">
            <BatteryMedium size={16} />
          </span>
          <div className="row-main">
            <div className="row-title">Battery</div>
            <div className="row-sub">{charging ? 'Charging' : 'On battery'}</div>
          </div>
          <span className="row-meta">{battery}%</span>
        </button>
      </div>

      <span className="section-label">Device</span>
      <div className="list">
        <div className="row setting-row">
          <span className="setting-icon">
            <ShieldCheck size={16} />
          </span>
          <div className="row-main">
            <div className="row-title">Software update</div>
            <div className="row-sub">BananaOS 1.0 · up to date</div>
          </div>
          <span className="settings-badge">Latest</span>
        </div>
        <div className="row setting-row">
          <span className="setting-icon">
            <Smartphone size={16} />
          </span>
          <div className="row-main">
            <div className="row-title">Storage</div>
            <div className="row-sub">34.2 GB of 128 GB used</div>
          </div>
        </div>
        <div className="storage-bar">
          <i style={{ width: '27%' }} />
          <i style={{ width: '14%', background: '#4F8CF7' }} />
          <i style={{ width: '9%', background: '#B07CF7' }} />
        </div>
      </div>

      <p className="settings-foot">BananaOS Plantain 1.0 (24A341) · Model Banana Phone 15</p>
    </div>
  );
}
