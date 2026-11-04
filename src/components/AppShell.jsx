import { Glyph } from '../os/Glyph'

export function AppShell({ title, subtitle, onBack, actions, children, className = '', headless = false }) {
  return (
    <section className={`app-layer ${className}`}>
      {!headless && (
        <header className="app-head">
          {onBack ? (
            <button type="button" className="head-btn" onClick={onBack} aria-label="Back">
              <Glyph name="back" size={20} strokeWidth={2.1} />
            </button>
          ) : (
            <span className="head-spacer" />
          )}
          <div className="head-titles">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="head-actions">{actions}</div>
        </header>
      )}
      <div className="app-body">{children}</div>
    </section>
  )
}
