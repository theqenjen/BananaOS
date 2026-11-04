import React from 'react';
import { Icon } from './icons';

export function AppFrame({ title, subtitle, onBack, right, children, className = '', bodyClassName = '' }) {
  return (
    <div className={`app-frame ${className}`}>
      <header className="app-header">
        <div className="app-header-side left">
          {onBack ? (
            <button type="button" className="icon-button" onClick={onBack} aria-label="Back">
              <Icon name="chevronLeft" size={22} />
            </button>
          ) : null}
        </div>
        <div className="app-header-title">
          <h1>{title}</h1>
          {subtitle ? <span className="app-header-subtitle">{subtitle}</span> : null}
        </div>
        <div className="app-header-side right">{right}</div>
      </header>
      <div className={`app-body ${bodyClassName}`}>{children}</div>
    </div>
  );
}

export function IconButton({ name, label, onClick, active = false, size = 20, className = '' }) {
  return (
    <button
      type="button"
      className={`icon-button ${active ? 'active' : ''} ${className}`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <Icon name={name} size={size} />
    </button>
  );
}

export function EmptyState({ title, note, icon = 'notes' }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name={icon} size={26} />
      </div>
      <p className="empty-title">{title}</p>
      {note ? <p className="empty-note">{note}</p> : null}
    </div>
  );
}
