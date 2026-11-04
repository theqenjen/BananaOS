import { useOS } from '../os/OSProvider'
import { APPS, DOCK_APPS, HOME_APPS } from '../os/appRegistry'
import { AppIcon } from './AppIcon'

const HOURS = [
  { t: 'Now', deg: 11, icon: '🌧' },
  { t: '17', deg: 11, icon: '🌧' },
  { t: '18', deg: 10, icon: '☁️' },
  { t: '19', deg: 9, icon: '☁️' },
]

export function HomeScreen() {
  const { actions, unreadTotal, data } = useOS()
  const hour = new Date().getHours()
  const partOfDay = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const greeting = data.profile.name ? `${partOfDay}, ${data.profile.name}` : partOfDay

  return (
    <div className="home">
      <div className="home-topline">{greeting}</div>

      <button type="button" className="widget" onClick={() => actions.openApp('weather')}>
        <div className="widget-head">
          <span>London</span>
          <span className="widget-now">Now</span>
        </div>
        <div className="widget-main">
          <span className="widget-temp">11°</span>
          <span className="widget-desc">
            Light rain
            <small>H 13° · L 7°</small>
          </span>
        </div>
        <div className="widget-hours">
          {HOURS.map((hour) => (
            <span key={hour.t}>
              <em>{hour.t}</em>
              <b>{hour.icon}</b>
              <i>{hour.deg}°</i>
            </span>
          ))}
        </div>
      </button>

      <div className="home-grid">
        {HOME_APPS.map((id) => (
          <AppIcon
            key={id}
            app={APPS[id]}
            label
            onClick={() => actions.openApp(id)}
            badge={id === 'messages' ? unreadTotal : 0}
          />
        ))}
      </div>

      <div className="page-dots" aria-hidden="true">
        <span className="on" />
        <span />
      </div>
    </div>
  )
}

export function Dock() {
  const { actions, ui } = useOS()
  return (
    <div className={`dock ${ui.activeApp ? 'is-behind' : ''}`}>
      {DOCK_APPS.map((id) => (
        <AppIcon key={id} app={APPS[id]} size={54} onClick={() => actions.openApp(id)} />
      ))}
    </div>
  )
}
