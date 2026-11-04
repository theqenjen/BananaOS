import { useOS } from '../os/OSProvider'
import { Glyph } from '../os/Glyph'

function Toggle({ on, icon, label, sublabel, onToggle }) {
  return (
    <button
      type="button"
      className={`cc-toggle ${on ? 'is-on' : ''}`}
      onClick={onToggle}
      aria-pressed={on}
      aria-label={label}
    >
      <span className="cc-toggle-icon">
        <Glyph name={icon} size={19} strokeWidth={2} />
      </span>
      <span className="cc-toggle-text">
        <strong>{label}</strong>
        <small>{sublabel}</small>
      </span>
    </button>
  )
}

export function ControlCenter() {
  const { data, ui, actions } = useOS()
  if (!ui.controlCenter) return null
  const s = data.settings

  return (
    <div className="cc" role="dialog" aria-label="Control Centre">
      <button
        type="button"
        className="cc-backdrop"
        aria-label="Close Control Centre"
        onClick={() => actions.setControlCenter(false)}
      />
      <div className="cc-panel">
        <div className="cc-grid">
          <Toggle
            on={s.airplane}
            icon="globe"
            label="Airplane"
            sublabel={s.airplane ? 'On' : 'Off'}
            onToggle={() =>
              actions.updateSettings({ airplane: !s.airplane, wifi: s.airplane ? s.wifi : false })
            }
          />
          <Toggle
            on={s.wifi && !s.airplane}
            icon="wifi"
            label="Wi-Fi"
            sublabel={s.airplane ? 'Airplane' : s.wifi ? 'BananaNet' : 'Off'}
            onToggle={() => actions.updateSettings({ wifi: !s.wifi, airplane: false })}
          />
          <Toggle
            on={s.bluetooth}
            icon="signal"
            label="Bluetooth"
            sublabel={s.bluetooth ? 'On' : 'Off'}
            onToggle={() => actions.updateSettings({ bluetooth: !s.bluetooth })}
          />
          <Toggle
            on={s.focus}
            icon="moon"
            label="Focus"
            sublabel={s.focus ? 'Do not disturb' : 'Off'}
            onToggle={() => actions.updateSettings({ focus: !s.focus })}
          />
        </div>

        <div className="cc-slider">
          <Glyph name="sun" size={17} strokeWidth={2} />
          <input
            type="range"
            min="35"
            max="100"
            value={Math.round(s.brightness * 100)}
            aria-label="Brightness"
            onChange={(event) => actions.updateSettings({ brightness: Number(event.target.value) / 100 })}
          />
        </div>
        <div className="cc-slider">
          <Glyph name="speaker" size={17} strokeWidth={2} />
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(s.volume * 100)}
            aria-label="Volume"
            onChange={(event) => actions.updateSettings({ volume: Number(event.target.value) / 100 })}
          />
        </div>

        <div className="cc-footer">
          <button type="button" className="cc-action" onClick={() => actions.openApp('settings')}>
            <Glyph name="settings" size={16} strokeWidth={2} />
            Settings
          </button>
          <button type="button" className="cc-action" onClick={actions.lock}>
            <Glyph name="lock" size={16} strokeWidth={2} />
            Lock
          </button>
        </div>
        <div className="cc-handle" aria-hidden="true" />
      </div>
    </div>
  )
}
