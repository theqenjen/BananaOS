import { Wifi, Bluetooth, Plane, Moon, SunMedium, Flame, BatteryCharging, BatteryMedium } from 'lucide-react';
import { useDevice } from '../state/DeviceContext.jsx';

export default function ControlCenter({ onClose }) {
  const { settings, patch, battery, charging, toggleCharging } = useDevice();

  return (
    <div className="cc-root">
      <div className="cc-scrim" onClick={onClose} />
      <div className="control-center" role="dialog" aria-label="Control Centre">
        <div className="cc-head">
          <span>Control Centre</span>
          <button className="cc-done" onClick={onClose} type="button">
            Done
          </button>
        </div>

        <div className="cc-grid">
          <div className="cc-tile cc-tile-wide">
            <button
              className={`cc-toggle ${settings.airplane ? 'is-on' : ''}`}
              onClick={() => patch({ airplane: !settings.airplane })}
              type="button"
            >
              <Plane size={19} />
            </button>
            <button
              className={`cc-toggle ${!settings.airplane && settings.wifi ? 'is-on' : ''}`}
              onClick={() => patch({ wifi: !settings.wifi, airplane: false })}
              type="button"
            >
              <Wifi size={19} />
            </button>
            <button
              className={`cc-toggle ${settings.bluetooth ? 'is-on' : ''}`}
              onClick={() => patch({ bluetooth: !settings.bluetooth })}
              type="button"
            >
              <Bluetooth size={19} />
            </button>
            <div className="cc-tile-meta">
              <strong>{settings.airplane ? 'Airplane Mode' : 'BananaNet'}</strong>
              <span>{settings.airplane ? 'Calls off' : settings.wifi ? 'Wi-Fi · Peel-5G' : 'Mobile data'}</span>
            </div>
          </div>

          <button
            className={`cc-tile cc-small ${settings.dnd ? 'is-on' : ''}`}
            onClick={() => patch({ dnd: !settings.dnd })}
            type="button"
          >
            <Moon size={20} />
            <span>Focus</span>
          </button>
          <button className="cc-tile cc-small" type="button">
            <Flame size={20} />
            <span>Torch</span>
          </button>
        </div>

        <div className="cc-slider-card">
          <SunMedium size={16} />
          <input
            type="range"
            min="20"
            max="100"
            value={settings.brightness}
            onChange={(e) => patch({ brightness: Number(e.target.value) })}
            aria-label="Brightness"
          />
          <span className="cc-slider-value">{settings.brightness}%</span>
        </div>

        <button className="cc-battery" onClick={toggleCharging} type="button">
          {charging ? <BatteryCharging size={22} /> : <BatteryMedium size={22} />}
          <div>
            <strong>{battery}% battery</strong>
            <span>{charging ? 'Charging · tap to unplug' : 'Tap to plug in'}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
