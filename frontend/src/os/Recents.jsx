import { X } from 'lucide-react';

export default function Recents({ openApps, onActivate, onCloseApp, onDismiss }) {
  return (
    <div className="recents-root">
      <div className="recents-scrim" onClick={onDismiss} />
      <div className="recents-panel">
        <div className="recents-head">
          <span>Recent apps</span>
          <button type="button" onClick={onDismiss} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>

        {openApps.length === 0 ? (
          <p className="recents-empty">No recent apps. Swipe up from the home bar after opening one.</p>
        ) : (
          <div className="recents-row">
            {openApps.map(({ uid, app }) => {
              const Icon = app.icon;
              return (
                <div className="recent-card" key={uid}>
                  <button className="recent-open" type="button" onClick={() => onActivate(uid)}>
                    <span className="recent-art" style={{ background: app.tint }}>
                      <Icon size={34} strokeWidth={1.8} />
                    </span>
                    <span className="recent-name">{app.name}</span>
                  </button>
                  <button className="recent-close" type="button" aria-label={`Close ${app.name}`} onClick={() => onCloseApp(uid)}>
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
