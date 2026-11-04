import { useOS } from '../os/OSProvider'
import { APPS } from '../os/appRegistry'
import { Glyph } from '../os/Glyph'

export function AppSwitcher() {
  const { ui, actions } = useOS()
  if (!ui.switcher) return null

  return (
    <div className="switcher">
      <div className="switcher-head">
        <span>Recent apps</span>
        <button type="button" className="switcher-close" onClick={actions.goHome}>
          Done
        </button>
      </div>
      {ui.recents.length === 0 ? (
        <div className="switcher-empty">
          <Glyph name="keypadGrid" size={30} strokeWidth={1.6} />
          <p>Open an app and it will show up here.</p>
        </div>
      ) : (
        <div className="switcher-rail">
          {ui.recents.map((id) => {
            const app = APPS[id]
            if (!app) return null
            return (
              <div key={id} className={`switcher-card tint-${app.tint}`}>
                <button type="button" className="switcher-open" onClick={() => actions.openApp(id)}>
                  <span className="switcher-icon">
                    <Glyph name={app.icon} size={30} strokeWidth={1.7} />
                  </span>
                  <span className="switcher-name">{app.name}</span>
                </button>
                <button
                  type="button"
                  className="switcher-kill"
                  aria-label={`Close ${app.name}`}
                  onClick={() => actions.closeRecent(id)}
                >
                  <Glyph name="x" size={13} strokeWidth={2.4} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
